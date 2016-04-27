module.exports  = function(){
  var chai = require('chai')
  var mocha = require('mocha')
  var should = chai.should();
  var request = require('request');
  var app = require('../server.js');
  var user = require('../models/user.js')

  describe('/authenticate route', () => {
    user.create({
      username: "testUser",
      firstname: "max",
      lastname: "mustermann",
      password: "testPW",
      permission: 1
    })

    it('should response to authentication with token', () => {
      request.post({
        url:'http://localhost:8080/authenticate',
        body: {
          "username": "test",
          "password": "testpassword",
        },
        json:true
      }).then((err, res, body) => {
       expect(res.statusCode).to.equal(200);
       res.body.should.have.property('token');
     })
    });

    it('should response to wrong authentication with success false', () => {
      request.post({
        url:'http://localhost:8080/authenticate',
        body: {
          "username": "test",
          "password": "testpassword",
        },
        json:true
      }, function (err, res, body){
       expect(res.statusCode).to.equal(200);
       res.body.should.have.property('token');
     })
    });
  })
}
