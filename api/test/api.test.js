'use strict'

module.exports  = function(){

  const mocha = require('mocha');
  const chai = require('chai');
  const should = chai.should();
  const app = require('../server.js');
  const db = require('../models/index');
  const chaiHttp = require('chai-http');
  const jwt    = require('jsonwebtoken');
  const config = require('../config/config.js');
  chai.use(chaiHttp);

  before(function(done){
    db.User.sync({force:true}).then(() => {
      db.User.create({
        username: "test",
        firstname: "test",
        lastname: "test",
        password: "test",
        permission: 1
      }).then(() => done())
    })
  })

  describe('/api route -> check restriction access', () => {

    var token = jwt.sign({
      username: "test",
      firstname: "test",
      lastname: "test",
      permission: 1
    }, config.secret, { expiresIn: '24h' });

    it('should response status 200 to api call, when send with token', (done) => {
      chai.request(app)
      .get('/api/')
      .send({ token: token })
      .then( res => {
        res.status.should.be.equal(200)
        res.body.msg.should.be.equal("you have access to the api")
        done();
      })
      .catch( res => {
      })
    })


    it('should response status 400 to api call, when send with wrong token', (done) => {
      chai.request(app)
      .get('/api/')
      .send({ token: token+1 })
      .catch( res => {
        res.status.should.be.equal(400)
        res.response.body.error.msg.should.be.equal("invalid signature")
        done();
      })
    })


    it('should response status 400 to api call, when send without token', (done) => {
      chai.request(app)
      .get('/api/')
      .send({})
      .catch( res => {
        res.status.should.be.equal(400)
        res.response.body.error.msg.should.be.equal("No token provided")
        done();
      })
    })

    it('should response status 400 to api call, when send with expired token', (done) => {
      var expiredToken =  jwt.sign({
        username: "test",
        firstname: "test",
        lastname: "test",
        permission: 1
      }, config.secret, { expiresIn: '0' });

      chai.request(app)
      .get('/api/')
      .send({ token: expiredToken })
      .catch( res => {
       res.status.should.be.equal(400)
       res.response.body.error.msg.should.be.equal("jwt expired")
       done();
     })
    })
  })
}
