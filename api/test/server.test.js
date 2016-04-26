'use strict'

const chai = require('chai')
const mocha = require('mocha')
const should = chai.should();
const app = require('../server.js')
const ioClient = require('socket.io-client');

describe('connection', () => {
    it('client gets informed when connected', function () {
        let client = ioClient.connect("http://localhost:8080")
        client.once("connect", function () {
            client.once("connected", function (data) {
                data.should.equal(true);
                client.disconnect();
            });
        });
    });
})

describe('authentication', function(done){
	 it('client gets informed when connected', function () {
	 	/*
	 	 var client = ioClient.connect("http://localhost:8080")
	 	client.once("authenticationRequest", function () {
           	"blah".should.equal(2)*/
    })
})
