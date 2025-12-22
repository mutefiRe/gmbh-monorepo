'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const ioClient = require('socket.io-client');

const token = jwt.sign({
  username: "test",
  firstname: "test",
  lastname: "test",
  role: "admin"
}, config.secret, { expiresIn: '24h' });

describe('socket basic connection with authentication', () => {

  it('client connects with token -> should get response connected', done => {
    const client = ioClient.connect(`http://localhost:${process.env.PORT || 8080}`, {
      query: 'token=' + token
    });
    client.once("connect", () => {
      client.once("connected", data => {
        assert.equal(data, true);
        client.disconnect();
        done();
      });
    });
  });

  it('client connects without token -> should get credentials_required message', done => {
    const client = ioClient.connect(`http://localhost:${process.env.PORT || 8080}`);
    client.once("connect", () => {
        // trigger when reach this -> Authentication failed
      assert.fail('expected connection to fail without token');
      client.disconnect();
    });
    client.on("error", error => {
      try {
        assert.equal(error.code, 'credentials_required');
        client.disconnect();
        done();
      } catch(e) {
        done(e);
      }
    });
  });

  it('client connects with expired token -> should get invalid_token message', done => {
    const expiredToken = jwt.sign({
      username: "test",
      firstname: "test",
      lastname: "test",
      role: "admin"
    }, config.secret, { expiresIn: '0' });

    const client = ioClient.connect(`http://localhost:${process.env.PORT || 8080}`, {
      query: 'token=' + expiredToken
    });

    client.once("connect", () => {
        // trigger when reach this -> Authentication failed
      assert.fail('expected connection to fail with expired token');
    });
    client.on("error", error => {
      try {
        assert.equal(error.code, 'invalid_token');
        client.disconnect();
        done();
      } catch(e) {
        done(e);
      }
    });
  });
});
