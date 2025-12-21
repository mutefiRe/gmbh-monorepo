'use strict';

const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');

require('../../../server');
const db = require('../../../models/index');
const jwt = require('jsonwebtoken');
const config = require('../../../config/config');

const { clean, getEventId, requestJson } = require('../../../__tests__/helper');

const token = jwt.sign({
  id: 1,
  username: "test1",
  firstname: "test1",
  lastname: "test1",
  role: "admin"
}, config.secret, { expiresIn: '24h' });

describe('/events route', () => {
  let activeEventId;

  before(async () => {
    await clean();
    activeEventId = getEventId();
  });

  it('should list events with activeEventId', async () => {
    const res = await requestJson({ path: '/api/events', token });
    assert.equal(res.status, 200);
    assert.equal(res.body.activeEventId, activeEventId);
    assert.ok(Array.isArray(res.body.events));
    assert.ok(res.body.events.length > 0);
  });

  it('should create a new event', async () => {
    const res = await requestJson({
      method: 'POST',
      path: '/api/events',
      token,
      body: { event: { name: 'Neues Event' } }
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.event.name, 'Neues Event');
    assert.equal(typeof res.body.event.id, 'string');
  });

  it('should update an event', async () => {
    const event = await db.Event.create({ name: 'Update Event' });
    const res = await requestJson({
      method: 'PUT',
      path: `/api/events/${event.id}`,
      token,
      body: { event: { name: 'Aktualisiert' } }
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.event.name, 'Aktualisiert');
  });

  it('should block writes to inactive events', async () => {
    const inactiveEvent = await db.Event.create({ name: 'Inaktiv' });
    await db.Category.create({ id: 1, name: 'Testcat', enabled: true, eventId: inactiveEvent.id });
    await db.Unit.create({ id: 1, name: 'Testunit', eventId: inactiveEvent.id });

    const res = await requestJson({
      method: 'POST',
      path: '/api/items',
      token,
      eventId: inactiveEvent.id,
      body: {
        item: {
          name: 'Item X',
          amount: 1,
          price: 2.5,
          categoryId: "1",
          unitId: "1"
        }
      }
    });
    assert.equal(res.status, 403);
    assert.match(res.text, /event is inactive/);
  });
});
