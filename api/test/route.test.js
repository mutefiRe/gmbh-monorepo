'use strict'

module.exports = function(){

    const chai = require('chai');
  const mocha = require('mocha');
  const request = require('request');
  const app = require('../server');
  const chaiHttp = require('chai-http');
  const should = require('chai').should();
  const db = require('../models/index');

  chai.use(chaiHttp);

  describe('/user route', () => {
    it('should response to user', (done) => {
      chai.request(app)
        .get('/api/user/1')
        .then(res => {
          res.should.have.status(200);
          done()
        })
        .catch(error => {
          done()
        })
    })


  })
}
