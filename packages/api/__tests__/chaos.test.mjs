import test from 'node:test';
import assert from 'node:assert/strict';

const API_BASE = process.env.CHAOS_API_BASE || 'http://localhost:8080';

const jsonRequest = async (method, path, token, eventId, body) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['x-access-token'] = token;
  if (eventId) headers['x-event-id'] = eventId;
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (error) {
    data = { raw: text };
  }
  return { status: res.status, data };
};

test('chaos: admin API manipulation and orders still work', async (t) => {
  let token = '';
  let eventId = null;
  let unitId = '';
  let categoryId = '';
  let areaId = '';
  let tableId = '';
  let itemId = '';

  await t.test('login and event', async () => {
    const loginRes = await jsonRequest('POST', '/authenticate', null, null, {
      username: 'admin',
      password: 'bierh0len!',
    });
    assert.equal(loginRes.status, 200);
    token = loginRes.data.token;
    assert.ok(token);

    const eventsRes = await jsonRequest('GET', '/api/events', token, null);
    assert.equal(eventsRes.status, 200);
    eventId = eventsRes.data.activeEventId || eventsRes.data.events?.[0]?.id || null;
  });

  await t.test('creates baseline data with odd values', async () => {
    const unitRes = await jsonRequest('POST', '/api/units', token, eventId, { unit: { name: 'Liter' } });
    assert.equal(unitRes.status, 200);
    unitId = unitRes.data.unit.id;
    assert.ok(unitId);

    const areaRes = await jsonRequest('POST', '/api/areas', token, eventId, {
      area: { name: 'Main', short: 'M', enabled: true },
    });
    assert.equal(areaRes.status, 200);
    areaId = areaRes.data.area.id;
    assert.ok(areaId);

    const tableRes = await jsonRequest('POST', '/api/tables', token, eventId, {
      table: { name: '99', seats: 2, enabled: true, areaId },
    });
    assert.equal(tableRes.status, 200);
    tableId = tableRes.data.table.id;
    assert.ok(tableId);

    const categoryRes = await jsonRequest('POST', '/api/categories', token, eventId, {
      category: {
        name: 'Verrückt & Bunt',
        enabled: true,
        icon: 'glass',
        color: '#22c55e',
        showAmount: true,
      },
    });
    assert.equal(categoryRes.status, 200);
    categoryId = categoryRes.data.category.id;
    assert.ok(categoryId);

    const itemRes = await jsonRequest('POST', '/api/items', token, eventId, {
      item: {
        name: 'Superlanges Getränk mit Sonderzeichen!!!',
        amount: 0.33,
        price: 9.99,
        sort: 9999,
        enabled: true,
        categoryId,
        unitId,
      },
    });
    assert.equal(itemRes.status, 200);
    itemId = itemRes.data.item.id;
    assert.ok(itemId);
  });

  await t.test('rejects invalid requests but allows new orders', async () => {
    const badItemRes = await jsonRequest('POST', '/api/items', token, eventId, {
      item: { name: 'Bad Item', price: 'not-a-number', amount: 1 },
    });
    assert.equal(badItemRes.status, 400);

    const badOrderRes = await jsonRequest('POST', '/api/orders', token, eventId, {
      order: { tableId },
    });
    assert.equal(badOrderRes.status, 400);

    const orderRes = await jsonRequest('POST', '/api/orders', token, eventId, {
      order: {
        tableId,
        orderitems: [
          { itemId, count: 2, countPaid: 0, countFree: 0, price: 9.99, extras: 'extra schaum' },
        ],
      },
    });
    assert.equal(orderRes.status, 200);
  });

  await t.test('handles payment updates and a second order', async () => {
    const orderRes = await jsonRequest('POST', '/api/orders', token, eventId, {
      order: {
        tableId,
        orderitems: [
          { itemId, count: 3, countPaid: 0, countFree: 0, price: 9.99 },
        ],
      },
    });
    assert.equal(orderRes.status, 200);
    const order = orderRes.data.order;

    const updatedItems = (order.orderitems || []).map((oi) => ({
      id: oi.id,
      count: oi.count,
      countPaid: Math.max(1, Math.floor(oi.count / 2)),
      countFree: oi.countFree || 0,
      price: oi.price,
    }));

    const updateRes = await jsonRequest('PUT', `/api/orders/${order.id}`, token, eventId, {
      order: { id: order.id, orderitems: updatedItems },
    });
    assert.equal(updateRes.status, 200);

    const orderRes2 = await jsonRequest('POST', '/api/orders', token, eventId, {
      order: {
        tableId,
        orderitems: [
          { itemId, count: 1, countPaid: 1, countFree: 0, price: 9.99 },
        ],
      },
    });
    assert.equal(orderRes2.status, 200);
  });
});
