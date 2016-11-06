'use strict'

const chai     = require('chai');
const expect   = chai.expect;
const app      = require('../../server.js');
const db       = require('../../models/index');
const chaiHttp = require('chai-http');
const jwt      = require('jsonwebtoken');
const config   = require('../../config/config.js');

chai.use(chaiHttp);

module.exports = function(){

  const token = jwt.sign({
    username: "test",
    firstname: "test",
    lastname: "test",
    permission: 1
  }, config.secret, { expiresIn: '24h' });

  describe('/user route', () => {

    before(done => {
      db.User.create({username: "test1", firstname: "test1", lastname: "test1", password: "test1", permission: 0})
      .then(() => {
        return  db.User.create({ username: "test2", firstname: "test2", lastname: "test2", password: "test2", permission: 1 });
      })
      .then(() => done());
    });

    describe('GET all users', () => {
      it('should get all users', done => {
        chai.request(app)
        .get('/api/users/')
        .send({ token })
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.users.length).to.equal(2);
          done();
        });
      });
    });

    describe('GET one user', () => {
      it('should get one user', done => {
        chai.request(app)
        .get('/api/users/1')
        .send({ token })
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.user.username).to.equal("test1");
          done();
        });
      });
    });
  });
};
