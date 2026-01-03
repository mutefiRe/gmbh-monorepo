import { fetch, Agent } from 'undici';
import pLimit from 'p-limit';
const BASE_URL = (process.env.BASE_URL || '').replace(/\/$/, '');
const ADMIN_USER = process.env.ADMIN_USER || '';
const ADMIN_PASS = process.env.ADMIN_PASS || '';
const EVENT_ID = process.env.EVENT_ID || '';
const WAITERS = Number(process.env.WAITERS || 5);
const WAITERS_PASSWORD = process.env.WAITERS_PASSWORD || 'gehmal25';
const WAITERS_LIST = process.env.WAITERS_LIST || '';
const MIN_ORDERS = Number(process.env.MIN_ORDERS || 100);
const CONCURRENCY = Number(process.env.CONCURRENCY || 10);
const DURATION_SECONDS = Number(process.env.DURATION_SECONDS || 30);
const RATE_PER_SEC = Number(process.env.RATE_PER_SEC || 5);
const CUSTOM_TABLE_RATE = Number(process.env.CUSTOM_TABLE_RATE || 0.2);
const EXTRAS_RATE = Number(process.env.EXTRAS_RATE || 0.35);
const PRINT_RATE = Number(process.env.PRINT_RATE || 0);
const INSECURE_TLS = ['1', 'true', 'yes'].includes((process.env.INSECURE_TLS || '').toLowerCase());

if (!BASE_URL || !ADMIN_USER || !ADMIN_PASS) {
  console.error('Missing required env: BASE_URL, ADMIN_USER, ADMIN_PASS');
  process.exit(1);
}

const httpsDispatcher = INSECURE_TLS && BASE_URL.startsWith('https://')
  ? new Agent({ connect: { rejectUnauthorized: false } })
  : undefined;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function request(path, { method = 'GET', body, token, eventId } = {}) {
  const headers = { 'content-type': 'application/json' };
  if (token) headers['x-access-token'] = token;
  if (eventId !== undefined) headers['x-event-id'] = eventId;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    dispatcher: httpsDispatcher
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (_) {
    data = text;
  }

  return { ok: res.ok, status: res.status, data };
}

async function adminLogin() {
  const res = await request('/authenticate', { method: 'POST', body: { username: ADMIN_USER, password: ADMIN_PASS } });
  if (!res.ok) {
    throw new Error(`Admin login failed: ${res.status} ${JSON.stringify(res.data)}`);
  }
  return res.data?.token;
}

async function resolveEventId(token) {
  if (EVENT_ID) return EVENT_ID;
  const res = await request('/api/events', { token, eventId: '' });
  if (!res.ok) {
    throw new Error(`Event fetch failed: ${res.status} ${JSON.stringify(res.data)}`);
  }
  return res.data?.activeEventId;
}

async function waiterLogin(username, password) {
  const res = await request('/authenticate', { method: 'POST', body: { username, password } });
  if (!res.ok) {
    throw new Error(`Waiter login failed: ${username} ${res.status}`);
  }
  return res.data?.token;
}

function parseWaiterList(raw) {
  if (!raw) return [];
  return raw
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [username, password] = entry.split(':');
      return { username, password: password || WAITERS_PASSWORD };
    });
}

function buildOrderPayload(items, tables) {
  const useCustomTable = Math.random() < CUSTOM_TABLE_RATE || tables.length === 0;
  const tableId = useCustomTable ? undefined : pick(tables).id;
  const customTableName = useCustomTable ? `Steh-${randomInt(1, 99)}` : undefined;

  const lineCount = randomInt(1, 6);
  const orderitems = Array.from({ length: lineCount }).map(() => {
    const item = pick(items);
    const extras = Math.random() < EXTRAS_RATE ? `Extra ${randomInt(1, 5)}` : undefined;
    const orderitem = {
      itemId: item.id,
      count: randomInt(1, 4),
      price: Number(item.price)
    };
    if (extras) {
      orderitem.extras = extras;
    }
    return orderitem;
  });

  const order = {
    orderitems
  };
  if (tableId) {
    order.tableId = tableId;
  }
  if (customTableName) {
    order.customTableName = customTableName;
  }
  return {
    order: {
      ...order
    }
  };
}

async function createOrder(token, eventId, payload) {
  return request('/api/orders', { method: 'POST', token, eventId, body: payload });
}

async function triggerPrint(token, eventId, orderId) {
  return request('/api/prints', {
    method: 'POST',
    token,
    eventId,
    body: { print: { orderId, isBill: false } }
  });
}

async function main() {
  console.log('gmbh load test starting');
  console.log(`Base URL: ${BASE_URL}`);

  const adminToken = await adminLogin();
  const eventId = await resolveEventId(adminToken);
  if (!eventId) {
    throw new Error('No active event found');
  }

  console.log(`Active event: ${eventId}`);

  const explicitWaiters = parseWaiterList(WAITERS_LIST);
  let waiterAccounts = explicitWaiters;
  if (waiterAccounts.length === 0) {
    const usersRes = await request('/api/users', { token: adminToken, eventId });
    if (!usersRes.ok) {
      throw new Error(`User list failed: ${usersRes.status} ${JSON.stringify(usersRes.data)}`);
    }
    waiterAccounts = (usersRes.data?.users || [])
      .filter((user) => user.role === 'waiter')
      .slice(0, WAITERS)
      .map((user) => ({ username: user.username, password: WAITERS_PASSWORD }));
  }

  const waiterTokens = [];
  for (const waiter of waiterAccounts) {
    try {
      const token = await waiterLogin(waiter.username, waiter.password);
      if (token) waiterTokens.push({ token, username: waiter.username });
    } catch (err) {
      console.warn('Waiter login failed', waiter.username, err.message);
    }
  }

  if (waiterTokens.length === 0) {
    throw new Error('No waiter tokens available');
  }

  const itemsRes = await request('/api/items', { token: adminToken, eventId });
  if (!itemsRes.ok) {
    throw new Error(`Items fetch failed: ${itemsRes.status} ${JSON.stringify(itemsRes.data)}`);
  }
  const items = itemsRes.data?.items || [];
  if (items.length === 0) {
    throw new Error('No items available to order');
  }

  const tablesRes = await request('/api/tables', { token: adminToken, eventId });
  const tables = tablesRes.ok ? (tablesRes.data?.tables || []) : [];

  console.log(`Waiters: ${waiterTokens.length}, Items: ${items.length}, Tables: ${tables.length}`);

  const limit = pLimit(CONCURRENCY);
  let orderCount = 0;
  let orderErrors = 0;

  const createOrderBatch = async (count) => {
    const tasks = [];
    for (let i = 0; i < count; i += 1) {
      const waiter = pick(waiterTokens);
      const payload = buildOrderPayload(items, tables);
      tasks.push(limit(async () => {
        const res = await createOrder(waiter.token, eventId, payload);
        if (!res.ok) {
          orderErrors += 1;
          console.warn(`Order failed ${res.status}`, res.data?.errors || res.data);
          return;
        }
        orderCount += 1;
        const orderId = res.data?.order?.id || res.data?.orderId;
        if (orderId && PRINT_RATE > 0 && Math.random() < PRINT_RATE) {
          const printRes = await triggerPrint(waiter.token, eventId, orderId);
          if (!printRes.ok) {
            console.warn(`Print failed ${printRes.status}`, printRes.data?.errors || printRes.data);
          }
        }
      }));
    }
    await Promise.all(tasks);
  };

  console.log(`Sustained load for ${DURATION_SECONDS}s at ~${RATE_PER_SEC}/s (min ${MIN_ORDERS} orders)...`);
  const end = Date.now() + DURATION_SECONDS * 1000;
  let lastLog = Date.now();
  while (Date.now() < end || orderCount < MIN_ORDERS) {
    await createOrderBatch(RATE_PER_SEC);
    const now = Date.now();
    if (now - lastLog >= 5000) {
      console.log(`Progress: ${orderCount} orders sent (${orderErrors} errors)`);
      lastLog = now;
    }
    await sleep(1000);
  }

  console.log('Load test complete');
  console.log(`Orders sent: ${orderCount}`);
  console.log(`Order errors: ${orderErrors}`);
}

main().catch((err) => {
  console.error('Load test failed', err);
  process.exit(1);
});
