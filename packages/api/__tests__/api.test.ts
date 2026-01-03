'use strict';

const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');

require('../server');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const { clean, getEventId, requestJson } = require('./helper');

describe('/api route -> check restriction access', () => {
  let eventId;
  before(async () => {
    await clean();
    eventId = getEventId();
  });
  const token = jwt.sign({
    username: "test",
    firstname:"test",
    lastname: "test",
    role:     "admin"
  }, config.secret, { expiresIn: '24h' });

  it('should response status 200 to api call, when send with token', async () => {
    const res = await requestJson({ path: '/api/orders', token, eventId });
    assert.equal(res.status, 200);
  });

  it('should respond to healthz', async () => {
    const res = await requestJson({ path: '/api/healthz', token });
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'ok');
  });

  it('should response status 400 to api call, when send with wrong token', async () => {
    const res = await requestJson({ path: '/api/orders', token: `${token}1`, eventId });
    assert.equal(res.status, 401);
    assert.match(res.text, /auth\.tokenError/);
  });

  it('should response status 400 to api call, when send without token', async () => {
    const res = await requestJson({ path: '/api/orders' });
    assert.equal(res.status, 401);
    assert.match(res.text, /auth\.tokenError/);
  });

  it('should response status 400 to api call, when send with expired token', async () => {
    const expiredToken = jwt.sign({
      username: "test",
      firstname: "test",
      lastname: "test",
      role: "admin"
    }, config.secret, { expiresIn: '0' });

    const res = await requestJson({ path: '/api/orders', token: expiredToken, eventId });
    assert.equal(res.status, 401);
    assert.match(res.text, /auth\.tokenError/);
  });

  describe('-> check role access', () => {
    const tokenWaiter = jwt.sign({
      username: "test",
      firstname:"test",
      lastname: "test",
      role:     "waiter"
    }, config.secret, { expiresIn: '24h' });

    it('should response with 403 for DELETE method (waiter: /orders/:id)', async () => {
      const res = await requestJson({ method: 'DELETE', path: '/api/orders/1', token: tokenWaiter, eventId });
      assert.equal(res.status, 403);
    });

    it('should be able to access PUT method (waiter: /orders/:id)', async () => {
      const res = await requestJson({ method: 'PUT', path: '/api/orders/1', token: tokenWaiter, eventId });
      assert.equal(res.status, 200);
    });

    it('should be able to access GET method (waiter: /orders/:id)', async () => {
      const res = await requestJson({ path: '/api/orders/1', token: tokenWaiter, eventId });
      assert.equal(res.status, 200);
    });

  });
});
