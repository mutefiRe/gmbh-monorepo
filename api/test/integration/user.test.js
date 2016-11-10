'use strict';

const chai     = require('chai');
const expect   = chai.expect;
const app      = require('../../server.js');
const db       = require('../../models/index');
const chaiHttp = require('chai-http');
const jwt      = require('jsonwebtoken');
const config   = require('../../config/config.js');
const cleaner  = require('../helper.js');

chai.use(chaiHttp);

module.exports = function(){

  const token = jwt.sign({
    id:         1,
    username:   "test1",
    firstname:  "test1",
    lastname:   "test1",
    permission: 1
  }, config.secret, { expiresIn: '24h' });

  describe('/user route', () => {
    before(done => {
      cleaner.clean(done);
    });

    describe('users exists', () => {

      before(done => {
        db.User.bulkCreate([
          {username: "test1", firstname: "test1", lastname: "test1", password: "test1", permission: 0},
          {username: "test2", firstname: "test2", lastname: "test2", password: "test2", permission: 1}])
        .then(() => {
          done();
        }).catch(error => {
          done(error);
        });
      });


      describe('GET users', () => {
        const expectedResponse = {
          "users": [{
            "id": 1,
            "username": "test1",
            "firstname": "test1",
            "lastname":  "test1",
            "permission": 0,
            "printer": null
          }, {
            "id": 2,
            "username": "test2",
            "firstname": "test2",
            "lastname":  "test2",
            "permission": 1,
            "printer": null
          }]
        };

        it('should get one user', done => {
          chai.request(app)
          .get('/api/users/1')
          .send({ token })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.user.username).to.equal("test1");
            done();
          });
        });

        it('should get all users', done => {
          chai.request(app)
          .get('/api/users/')
          .send({ token })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.users.length).to.equal(2);
            expect(res.body).to.deep.equal(expectedResponse);
            done();
          });
        });
      });

      describe('POST user', () => {
        const requestBody = {
          user: {
            username:   "username",
            firstname:  "firstname",
            lastname:   "lastname",
            password:   "password",
            permission: 0,
            printer:    null
          }
        };

        it('user should exist', done => {
          chai.request(app)
          .post('/api/users')
          .set("x-access-token", token)
          .send(requestBody)
          .then(res => {
            expect(res.status).to.equal(200);
            expect(res.body.user.username).to.equal("username");
            return db.User.find({where: {username: "username"}});
          }).then(user => {
            expect(user).not.to.be.null;
            expect(user.username).to.eq("username");
            expect(user.firstname).to.eq("firstname");
            expect(user.lastname).to.eq("lastname");
            expect(user.permission).to.eq(0);
            expect(user.printer).to.eq(null);
            done();
          }).catch(err => done(err));
        });
      });

      describe('PUT user', () => {
        const requestBody = {
          user: {
            username:   "username2",
            firstname:  "firstname",
            lastname:   "lastname",
            password:   "password",
            permission: 1,
            printer:    "test"
          }
        };

        it('user should have changed', done => {
          chai.request(app)
          .put('/api/users/1')
          .set("x-access-token", token)
          .send(requestBody)
          .then(res => {
            expect(res.status).to.equal(200);
            expect(res.body.user.username).to.equal("username2");
            return db.User.find({where: {username: "username2"}});
          }).then(user => {
            expect(user).not.to.be.null;
            expect(user.username).to.eq("username2");
            expect(user.firstname).to.eq("firstname");
            expect(user.lastname).to.eq("lastname");
            expect(user.permission).to.eq(1);
            expect(user.printer).to.eq("test");
            done();
          }).catch(err => done(err));
        });
      });
    });
  });
};
