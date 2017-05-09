'use strict';

const chai     = require('chai');
const expect   = chai.expect;
const app      = require('../server.js');
const db       = require('../models/index');
const chaiHttp = require('chai-http');
const jwt      = require('jsonwebtoken');
const config   = require('../config/config.js');

const { clean, removeTimestamps } = require('./helper.js');

chai.use(chaiHttp);


const token = jwt.sign({
  id:         1,
  username:   "test1",
  firstname:  "test1",
  lastname:   "test1",
  permission: 1
}, config.secret, { expiresIn: '24h' });

describe('/user route', () => {
  before(clean);

  describe('users exists', () => {

    before(() => {
      return db.User.bulkCreate([
        {id: 1, username: "test1", firstname: "test1", lastname: "test1", password: "test1", permission: 0},
        {id: 2, username: "test2", firstname: "test2", lastname: "test2", password: "test2", permission: 1}
      ]);
    });

    describe('GET users', () => {
      const expectedResponse = {
        "users": [{
          "id":         "1",
          "username":   "test1",
          "firstname":  "test1",
          "lastname":   "test1",
          "permission": 0,
          "printer":    null,
          "areas":      []
        }, {
          "id":         "2",
          "username":   "test2",
          "firstname":  "test2",
          "lastname":   "test2",
          "permission": 1,
          "printer":    null,
          "areas":      []
        }]
      };

      it('should get one user', () => {
        return chai.request(app)
        .get('/api/users/1')
        .send({ token })
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.user.username).to.equal("test1");
        });
      });

      it('should get all users', () => {
        return chai.request(app)
        .get('/api/users/')
        .send({ token })
        .then(res => {
          expect(res.status).to.equal(200);
          expect(removeTimestamps(res.body)).to.deep.equal(expectedResponse);
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

      it('user should exist', () => {
        return chai.request(app)
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
        });
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

      it('user should have changed', () => {
        return chai.request(app)
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
        });
      });
    });
  });
});
