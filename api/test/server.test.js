module.exports  = function(){
  var chai = require('chai')
  var mocha = require('mocha')
  var should = chai.should();
  var app = require('../server.js')

  var ioClient = require('socket.io-client');

  describe('connection', function(done){
    it('client gets informed when connected', function () {
      var client = ioClient.connect("http://localhost:8080")

      client.once("connect", function () {
        client.once("connected", function (data) {
          data.should.equal(true);
          client.disconnect();
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
