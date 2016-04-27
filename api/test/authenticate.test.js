'use strict'

module.exports  = function(){

  var mocha = require('mocha');
  var chai = require('chai');
  var should = chai.should();
  var app = require('../server.js');
  var db = require('../models/index');
  var chaiHttp = require('chai-http');
  chai.use(chaiHttp);


  describe('/authenticate route', () => {
    db.User.create({
      username: "testUser",
      firstname: "max",
      lastname: "mustermann",
      password: "testPW",
      permission: 1
    })

    it('should response to authentication with token', (done) => {
      chai.request(app)
      .post('/authenticate')
      .send({ username: 'testUser', password: 'testPW' })
      .then( res => {
        console.log(res.body)
        res.body.success.should.equal(true)
        res.should.have.status(200)
        res.body.should.have.property("token")
        done();
      })
    })

    it('should response to wrong username with no token', (done) => {
      chai.request(app)
      .post('/authenticate')
      .send({ username: 'wrongUser', password: 'wrongPW' })
      .then( res => {
        res.body.success.should.equal(false)
        res.should.have.status(200)
        res.body.should.not.have.property("token")
        done();
      })
    })
  })
}
