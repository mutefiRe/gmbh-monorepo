'use strict';

const app = require('../server.js');
const db = require('../models/index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

describe('/authenticate route', () => {

  before(() => {
    return db.User.create({
      username: "test",
      firstname: "max",
      lastname: "mustermann",
      password: "test",
      permission: 0
    });
  });

  describe('with valid username', () => {
    const username = "test";

    describe('and valid password', () => {
      const password = "test";
      it('should response to authentication with token', () => {
        return chai.request(app)
        .post('/authenticate')
        .send({ username, password })
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property("token");
        });
      });
    });

    describe('and invalid password', () => {
      const password = "wrong";
      it('should response no token', () => {
        return chai.request(app)
        .post('/authenticate')
        .send({ username, password })
        .catch(res => {
          expect(res.status).to.equal(400);
          expect(res.response).to.be.json;
          expect(res.response.text).to.contain('errors');
        });
      });
    });
  });

  describe('with invalid username', () => {
    const username = 'invalid';
    it('should response to wrong username with no token', () => {
      return chai.request(app)
      .post('/authenticate')
      .send({ username, password: 'test1' })
      .catch(res => {
        expect(res.status).to.equal(400);
        expect(res.response).to.be.json;
        expect(res.response.text).to.contain('errors');
      });
    });
  });
});

