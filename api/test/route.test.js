module.exports = function(){
  'use strict'

  const chai = require('chai');
  const mocha = require('mocha');
  const request = require('request');
  const Route = require('../router/user');
  const db = require('../models/index');


  describe('/user route', () => {
   it('should response to get', () => {
    request.get('http://localhost:8080/user/10', function(err, res, body){
     expect(res.statusCode).to.equal(200);
     expect(res.body).to.equal('user 10');
     done();
   });
  });
   it('should response to post', () => {
    request.post({
     url:'http://localhost:8080/user',
     body: {
      "username": "test",
      "password": "testpassword",
      "firstname": "testfirstname",
      "lastname": "testlastname",
      "permission": 1
    },
    json: true
  }, function (err, res, body){
   expect(res.statusCode).to.equal(200);
   expect(res.body).to.equal('created user test')
 });
  });
   it('should response to put', () => {
    request.put('http://localhost:8080/user/10', function(err, res, body){
     expect(res.statusCode).to.equal(200);
     expect(res.body).to.equal('updated user 10');
     done();
   });
  });
   it('should response to delete', () => {
    request.delete('http://localhost:8080/user/10', function(err, res, body){
     expect(res.statusCode).to.equal(200);
     expect(res.body).to.equal('deleted user 10');
     done();
   });
  });
 });

}
