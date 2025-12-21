'use strict';

const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');

require('../../server');
const db = require('../../models/index');
const { clean, requestJson } = require('../../__tests__/helper');

describe('/authenticate route', () => {

  before(async () => {
    await clean();
    await db.User.create({
      username: "test",
      firstname: "max",
      lastname: "mustermann",
      password: "test",
      role: "admin"
    });
  });

  describe('with valid username', () => {
    const username = "test";

    describe('and valid password', () => {
      const password = "test";
      it('should response to authentication with token', async () => {
        const res = await requestJson({
          method: 'POST',
          path: '/authenticate',
          body: { username, password }
        });
        assert.equal(res.status, 200);
        assert.ok(res.body.token);
      });
    });

    describe('and invalid password', () => {
      const password = "wrong";
      it('should response no token', async () => {
        const res = await requestJson({
          method: 'POST',
          path: '/authenticate',
          body: { username, password }
        });
        assert.equal(res.status, 401);
        assert.match(res.text, /errors/);
      });
    });
  });

  describe('with invalid username', () => {
    const username = 'invalid';
    it('should response to wrong username with no token', async () => {
      const res = await requestJson({
        method: 'POST',
        path: '/authenticate',
        body: { username, password: 'test1' }
      });
      assert.equal(res.status, 401);
      assert.match(res.text, /errors/);
    });
  });
});
