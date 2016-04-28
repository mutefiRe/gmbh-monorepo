module.exports = function(){
  'use strict'

  const chai = require('chai');
  const mocha = require('mocha');
  const request = require('request');
  const app = require('../server');
  const chaiHttp = require('chai-http');
  const should = require('chai').should();
  const db = require('../models/index');

  chai.use(chaiHttp);

  db.User.create({username: 'test', firstname: 'test', lastname: 'test', password:'test', permission:1})

  describe('/user route', () => {
    it('should response to authentication with token', (done) => {
      chai.request(app)
        .get('/api/user/1')
        .then(res => {
          console.log(res.status)
          res.should.have.status(200);
          done()
        })
        .catch(error => {
          console.log(error)
          done()
        })
    })
  })
}
