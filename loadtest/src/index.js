import { fetch } from 'undici';
import pLimit from 'p-limit';
import { randomUUID } from 'node:crypto';

const BASE_URL = (process.env.BASE_URL || '').replace(/\/$/, '');
const ADMIN_USER = process.env.ADMIN_USER || '';
const ADMIN_PASS = process.env.ADMIN_PASS || '';
const EVENT_ID = process.env.EVENT_ID || '';
const SEED = (process.env.SEED || 'true').toLowerCase() !== 'false';

const WAITERS = Number(process.env.WAITERS || 5);
const AREAS = Number(process.env.AREAS || 2);
const TABLES_PER_AREA = Number(process.env.TABLES_PER_AREA || 8);
const UNITS = Number(process.env.UNITS || 6);
const CATEGORIES = Number(process.env.CATEGORIES || 6);
const ITEMS = Number(process.env.ITEMS || 25);
const ORDERS_PER_WAITER = Number(process.env.ORDERS_PER_WAITER || 20);
const CONCURRENCY = Number(process.env.CONCURRENCY || 10);
const DURATION_SECONDS = Number(process.env.DURATION_SECONDS || 60);
const RATE_PER_SEC = Number(process.env.RATE_PER_SEC || 5);
const CUSTOM_TABLE_RATE = Number(process.env.CUSTOM_TABLE_RATE || 0.2);
const EXTRAS_RATE = Number(process.env.EXTRAS_RATE || 0.35);

if (!BASE_URL || !ADMIN_USER || !ADMIN_PASS) {
  console.error('Missing required env: BASE_URL, ADMIN_USER, ADMIN_PASS');
  process.exit(1);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatName(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

async function request(path, { method = 'GET', body, token, eventId } = {}) {
  const headers = { 'content-type': 'application/json' };
  if (token) headers['x-access-token'] = token;
  if (eventId !== undefined) headers['x-event-id'] = eventId;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
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

async function createArea(token, eventId, name, short) {
  const res = await request('/api/areas', { method: 'POST', token, eventId, body: { area: { name, short, enabled: true } } });
  return res.data?.area;
}

async function createTable(token, eventId, name, areaId) {
  const res = await request('/api/tables', { method: 'POST', token, eventId, body: { table: { name, areaId, enabled: true } } });
  return res.data?.table;
}

async function createUnit(token, eventId, name) {
  const res = await request('/api/units', { method: 'POST', token, eventId, body: { unit: { name, enabled: true } } });
  return res.data?.unit;
}

async function createCategory(token, eventId, name) {
  const res = await request('/api/categories', { method: 'POST', token, eventId, body: { category: { name, enabled: true, icon: 'utensils', color: '#e2e8f0' } } });
  return res.data?.category;
}

async function createItem(token, eventId, name, categoryId, unitId) {
  const price = Number((Math.random() * 8 + 1).toFixed(2));
  const res = await request('/api/items', {
    method: 'POST',
    token,
    eventId,
    body: { item: { name, categoryId, unitId, price, amount: 1, enabled: true } }
  });
  return res.data?.item;
}

async function createUser(token, eventId, username, password) {
  const res = await request('/api/users', {
    method: 'POST',
    token,
    eventId,
    body: { user: { username, firstname: 'Waiter', lastname: username.slice(-4), password, role: 'waiter' } }
  });
  return res.data?.user;
}

async function waiterLogin(username, password) {
  const res = await request('/authenticate', { method: 'POST', body: { username, password } });
  if (!res.ok) {
    throw new Error(`Waiter login failed: ${username} ${res.status}`);
  }
  return res.data?.token;
}

function buildOrderPayload(items, tables) {
  const useCustomTable = Math.random() < CUSTOM_TABLE_RATE || tables.length === 0;
  const tableId = useCustomTable ? null : pick(tables).id;
  const customTableName = useCustomTable ? `Steh-${randomInt(1, 99)}` : null;

  const lineCount = randomInt(1, 6);
  const orderitems = Array.from({ length: lineCount }).map(() => {
    const item = pick(items);
    const extras = Math.random() < EXTRAS_RATE ? `Extra ${randomInt(1, 5)}` : null;
    return {
      itemId: item.id,
      count: randomInt(1, 4),
      price: Number(item.price),
      extras
    };
  });

  return {
    order: {
      tableId,
      customTableName,
      orderitems
    }
  };
}

async function createOrder(token, eventId, payload) {
  return request('/api/orders', { method: 'POST', token, eventId, body: payload });
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

  const seed = {
    areas: [],
    tables: [],
    units: [],
    categories: [],
    items: [],
    users: []
  };

  if (SEED) {
    console.log('Seeding data...');

    for (let i = 0; i < AREAS; i += 1) {
      const area = await createArea(adminToken, eventId, formatName(`Bereich-${i + 1}`), `B${i + 1}`);
      if (area) seed.areas.push(area);
    }

    for (const area of seed.areas) {
      for (let i = 0; i < TABLES_PER_AREA; i += 1) {
        const table = await createTable(adminToken, eventId, String(i + 1), area.id);
        if (table) seed.tables.push(table);
      }
    }

    for (let i = 0; i < UNITS; i += 1) {
      const unit = await createUnit(adminToken, eventId, `U${i + 1}`);
      if (unit) seed.units.push(unit);
    }

    for (let i = 0; i < CATEGORIES; i += 1) {
      const category = await createCategory(adminToken, eventId, formatName(`Kategorie-${i + 1}`));
      if (category) seed.categories.push(category);
    }

    for (let i = 0; i < ITEMS; i += 1) {
      const item = await createItem(
        adminToken,
        eventId,
        formatName(`Item-${i + 1}`),
        pick(seed.categories).id,
        pick(seed.units).id
      );
      if (item) seed.items.push(item);
    }

    for (let i = 0; i < WAITERS; i += 1) {
      const username = formatName(`waiter-${i + 1}`);
      const password = `pw-${randomUUID().slice(0, 8)}`;
      const user = await createUser(adminToken, eventId, username, password);
      if (user) seed.users.push({ ...user, password });
    }
  }

  const waiterAccounts = seed.users.length > 0
    ? seed.users
    : Array.from({ length: WAITERS }).map((_, idx) => ({
        username: `waiter-${idx + 1}`,
        password: 'gehmal25'
      }));

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

  const items = seed.items.length > 0 ? seed.items : (await request('/api/items', { token: adminToken, eventId })).data?.items || [];
  const tables = seed.tables.length > 0 ? seed.tables : (await request('/api/tables', { token: adminToken, eventId })).data?.tables || [];

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
        } else {
          orderCount += 1;
        }
      }));
    }
    await Promise.all(tasks);
  };

  console.log(`Sending ${ORDERS_PER_WAITER} orders per waiter...`);
  await createOrderBatch(ORDERS_PER_WAITER * waiterTokens.length);

  console.log(`Sustained load for ${DURATION_SECONDS}s at ~${RATE_PER_SEC}/s...`);
  const end = Date.now() + DURATION_SECONDS * 1000;
  while (Date.now() < end) {
    await createOrderBatch(RATE_PER_SEC);
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
