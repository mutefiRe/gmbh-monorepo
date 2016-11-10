'use strict';

const app = require('../../server.js');
const db = require('../../models/index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

module.exports  = function(){

  describe('/authenticate route', () => {

    before(done => {
      db.User.create({
        username: "test",
        firstname: "max",
        lastname: "mustermann",
        password: "test",
        permission: 0
      }).then(() => {
        done();
      }).catch(error => {
        done(error);
      });
    });

    describe('with valid username', () => {
      const username = "test";

      describe('and valid password', () => {
        const password = "test";
        it('should response to authentication with token', done => {
          chai.request(app)
          .post('/authenticate')
          .send({ username, password })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property("token");
            done();
          });
        });
      });

      describe('and invalid password', () => {
        const password = "wrong";
        it('should response no token', done => {
          chai.request(app)
          .post('/authenticate')
          .send({ username, password })
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property("errors");
            done();
          });
        });
      });
    });

    describe('with invalid username', () => {
      const username = 'invalid';
      it('should response to wrong username with no token', done => {
        chai.request(app)
        .post('/authenticate')
        .send({ username, password: 'test1' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property("errors");
          done();
        });
      });
    });
  });
};
