'use strict'

module.exports  = function() {
  const app = require('../../server.js');
  const chai = require('chai');
  const expect = chai.expect;
  const jwt    = require('jsonwebtoken');
  const config = require('../../config/config.js');

  const ioClient = require('socket.io-client');

  const token = jwt.sign({
    username: "test",
    firstname: "test",
    lastname: "test",
    permission: 1
  }, config.secret, { expiresIn: '24h' });

  describe('socket basic connection with authentication', () => {

    it('client connects with token -> should get response connected', (done) => {
      const client = ioClient.connect(`http://localhost:${process.env.PORT}`, {
        query: 'token=' + token
      });
      client.once("connect", () => {
        client.once("connected", (data) => {
          expect(data).to.equal(true);
          client.disconnect();
          done()
        });
      });
    });

    it('client connects without token -> should get credentials_required message', (done) => {
      const client = ioClient.connect(`http://localhost:${process.env.PORT}`)
      client.once("connect", () => {
        // trigger when reach this -> Authentication failed
        expect(true).to.equal(false);
        client.disconnect();
      });
      client.on("error", (error) => {
        expect(error.code).to.equal('credentials_required')
        client.disconnect();
        done();
      });
    });

    it('client connects with expired token -> should get invalid_token message', (done) => {
      const expiredToken = jwt.sign({
        username: "test",
        firstname: "test",
        lastname: "test",
        permission: 1
      }, config.secret, { expiresIn: '0' });

      const client = ioClient.connect(`http://localhost:${process.env.PORT}`, {
        query: 'token=' + expiredToken
      });

      client.once("connect", function () {
        // trigger when reach this -> Authentication failed
        expect(true).to.equal(false);
        client.disconnect();
      });
      client.on("error", function(error) {
        expect(error.code).to.equal('invalid_token')
        client.disconnect();
        done();
      });
    });
  });
};
