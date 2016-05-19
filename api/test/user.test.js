module.exports = function(){
  'use strict'

  const mocha = require('mocha');
  const chai = require('chai');
  const should = chai.should();
  const app = require('../server.js');
  const db = require('../models/index');
  const chaiHttp = require('chai-http');
  const jwt    = require('jsonwebtoken');
  const config = require('../config/config.js');
  chai.use(chaiHttp);



  var token = jwt.sign({
    username: "test",
    firstname: "test",
    lastname: "test",
    permission: 1
  }, config.secret, { expiresIn: '24h' });

  describe('/user route', () => {
/*
    before(function(done){

    })
    */

    it('should get all users', (done) => {
      chai.request(app)
      .get('/api/user/')
      .send({ token: token })
      .then( res => {
        res.status.should.be.equal(200)
        res.body.users.length.should.be.equal(2)
        done();
      })
    })

    it('should get one user', (done) => {
      chai.request(app)
      .get('/api/user/1')
      .send({ token: token })
      .then( res => {
        res.status.should.be.equal(200)
        res.body.user.username.should.be.equal("test1")
        done();
      })
    })

    it('should get users with permission 0', (done) => {
      chai.request(app)
      .get('/api/user?permission=0')
      .send({ token: token })
      .then( res => {
        res.status.should.be.equal(200)
        res.body.users.length.should.be.equal(1)
        res.body.users[0].permission.should.be.equal(0)
        done();
      })
    })
  })
}
