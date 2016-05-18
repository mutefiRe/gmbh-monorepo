'use strict'

module.exports  = function(){
  var chai = require('chai')
  var mocha = require('mocha')
  var should = chai.should();

  var app = require('../server.js')

  var ioClient = require('socket.io-client');

  describe('server connection', function(done){
    it('client gets informed when connected', function () {
      var client = ioClient.connect("http://localhost:8080")

      client.on("connect", function () {
        client.on("connected", function (data) {
          data.should.be.equal(true);
          client.disconnect();
          done()
        });
      });
    });
  })

  /*describe('authentication', function(done){
    it('client gets informed when connected', function () {
	 	/*
	 	 var client = ioClient.connect("http://localhost:8080")
	 	client.once("authenticationRequest", function () {
      "blah".should.equal(2)
    })
  })*/
}

