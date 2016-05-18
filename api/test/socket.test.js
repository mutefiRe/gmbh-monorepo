'use strict'

module.exports  = function(){
  var chai = require('chai')
  var mocha = require('mocha')
  var should = chai.should();
  const jwt    = require('jsonwebtoken');
  var app = require('../server.js');
  const config = require('../config/config.js');

  var ioClient = require('socket.io-client');

  var token = jwt.sign({
    username: "test",
    firstname: "test",
    lastname: "test",
    permission: 1
  }, config.secret, { expiresIn: '24h' });

  describe('socket basic connection with authentication', function(){

    it('client connects with token -> should get response connected', function (done) {
      var client = ioClient.connect("http://localhost:8080", {
        query: 'token=' + token
      })
      client.once("connect", function () {
        client.once("connected", function (data) {
          data.should.be.equal(true);
          client.disconnect();
          done()
        });
      });
    });

    it('client connects without token -> should get credentials_required message', function (done) {
      var client = ioClient.connect("http://localhost:8080")
      client.once("connect", function () {
        //trigger when reach this -> Authentication failed
        (true).should.be.equal(false);
        client.disconnect();
      });
      client.on("error", function(error) {
        error.code.should.equal('credentials_required')
        client.disconnect();
        done();
      });
    });

    it('client connects with expired token -> should get invalid_token message', function (done) {
      let expiredToken = jwt.sign({
        username: "test",
        firstname: "test",
        lastname: "test",
        permission: 1
      }, config.secret, { expiresIn: '0' });


      var client = ioClient.connect("http://localhost:8080", {
        query: 'token=' + expiredToken
      })

      client.once("connect", function () {
        //trigger when reach this -> Authentication failed
        (true).should.be.equal(false);
        client.disconnect();
      });
      client.on("error", function(error) {
        error.code.should.equal('invalid_token')
        client.disconnect();
        done();
      });
    });
  })
}

