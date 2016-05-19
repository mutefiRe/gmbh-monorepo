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

    it('should response to authentication with token', (done) => {
      chai.request(app)
      .post('/authenticate')
      .send({ username: 'test1', password: 'test1' })
      .then( res => {
        res.status.should.be.equal(200)
        res.body.should.have.property("token")
        done();
      })
    })

    it('should response to wrong username with no token', (done) => {
      chai.request(app)
      .post('/authenticate')
      .send({ username: 'wrongUser', password: 'wrongPW' })
      .catch( res => {
        res.response.status.should.be.equal(400)
        res.response.body.should.have.property("error")
        done()
      })
    })
  })
}
