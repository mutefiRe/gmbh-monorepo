'use strict'

const chai = require('chai');
const mocha = require('mocha');
const request = require('request');
const should = chai.should();
const Route = require('../router/user');

describe('/user route', () => {
	it('should response to get', () => {
	 	 request.get('http://localhost:8080/user/10', function(err, res, body){
	 	 	expect(res.statusCode).to.equal(200);
	 	 	expect(res.body).to.equal('user 10');
	 	 	done();
	 	 });
    });
    it('should response to post', () => {
		request.post('http://localhost:8080/user/10', function(err, res, body){
			expect(res.statusCode).to.equal(200);
			expect(res.body).to.equal('save user 10');
			done();
		});
    });
    it('should response to put', () => {
		request.put('http://localhost:8080/user/10', function(err, res, body){
			expect(res.statusCode).to.equal(200);
			expect(res.body).to.equal('updated user 10');
			done();
		});
    });
});