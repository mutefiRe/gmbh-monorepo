'use strict';

const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');

require('../../../server');
const db = require('../../../models/index');
const jwt = require('jsonwebtoken');
const config = require('../../../config/config');

const { clean, removeTimestamps, requestJson } = require('../../../__tests__/helper');


const token = jwt.sign({
  id:         1,
  username:   "test1",
  firstname:  "test1",
  lastname:   "test1",
  role:       "admin"
}, config.secret, { expiresIn: '24h' });

describe('/user route', () => {
  before(clean);

  describe('users exists', () => {
    before(() => {
      return db.User.bulkCreate([
        {id: 1, username: "test1", firstname: "test1", lastname: "test1", password: "test1", role: "admin"},
        {id: 2, username: "test2", firstname: "test2", lastname: "test2", password: "test2", role: "waiter"}
      ])
    });

    describe('GET users', () => {
      const expectedResponse = {
        "users": [{
          "id":         "1",
          "username":   "test1",
          "firstname":  "test1",
          "lastname":   "test1",
          "role":       "admin",
          "areas":      []
        }, {
          "id":         "2",
          "username":   "test2",
          "firstname":  "test2",
          "lastname":   "test2",
          "role":       "waiter",
          "areas":      []
        }]
      };

      it('should get one user', async () => {
        const res = await requestJson({ path: '/api/users/1', token });
        assert.equal(res.status, 200);
        assert.equal(res.body.user.username, "test1");
      });

      it('should get all users', async () => {
        const res = await requestJson({ path: '/api/users/', token });
        assert.equal(res.status, 200);
        assert.deepEqual(removeTimestamps(res.body), expectedResponse);
      });
    });

    describe('POST user', () => {
      const requestBody = {
        user: {
          username:   "username",
          firstname:  "firstname",
          lastname:   "lastname",
          password:   "password",
          role:       "admin"
        }
      };

      it('user should exist', async () => {
        const res = await requestJson({ method: 'POST', path: '/api/users', token, body: requestBody });
        assert.equal(res.status, 200);
        assert.equal(res.body.user.username, "username");
        const user = await db.User.find({where: {username: "username"}});
        assert.notEqual(user, null);
        assert.equal(user.username, "username");
        assert.equal(user.firstname, "firstname");
        assert.equal(user.lastname, "lastname");
        assert.equal(user.role, "admin");
      });
    });

    describe('PUT user', () => {
      const requestBody = {
        user: {
          username:   "username2",
          firstname:  "firstname",
          lastname:   "lastname",
          password:   "password",
          role:       "admin"
        }
      };

      it('user should have changed', async () => {
        const res = await requestJson({ method: 'PUT', path: '/api/users/1', token, body: requestBody });
        assert.equal(res.status, 200);
        assert.equal(res.body.user.username, "username2");
        const user = await db.User.find({where: {username: "username2"}});
        assert.notEqual(user, null);
        assert.equal(user.username, "username2");
        assert.equal(user.firstname, "firstname");
        assert.equal(user.lastname, "lastname");
        assert.equal(user.role, "admin");
      });
    });
  });
});
