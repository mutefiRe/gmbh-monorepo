'use strict';

const chai     = require('chai');
const expect   = chai.expect;
const app = require('../server');
const db       = require('../models/index');
const chaiHttp = require('chai-http');
const jwt      = require('jsonwebtoken');
const config = require('../config/config');

const { clean, removeTimestamps, withAuth } = require('./helper');

chai.use(chaiHttp);


const token = jwt.sign({
  id:         1,
  username:   "test1",
  firstname:  "test1",
  lastname:   "test1",
  role:       "admin"
}, config.secret, { expiresIn: '24h' });

describe('/user route', () => {
  before(clean);

  describe('users exists', () => {
    before(() => {
      return db.User.bulkCreate([
        {id: 1, username: "test1", firstname: "test1", lastname: "test1", password: "test1", role: "admin"},
        {id: 2, username: "test2", firstname: "test2", lastname: "test2", password: "test2", role: "waiter"}
      ])
    });

    describe('GET users', () => {
      const expectedResponse = {
        "users": [{
          "id":         "1",
          "username":   "test1",
          "firstname":  "test1",
          "lastname":   "test1",
          "role":       "admin",
          "areas":      []
        }, {
          "id":         "2",
          "username":   "test2",
          "firstname":  "test2",
          "lastname":   "test2",
          "role":       "waiter",
          "areas":      []
        }]
      };

      it('should get one user', () => {
        return withAuth(chai.request(app).get('/api/users/1'), token)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.user.username).to.equal("test1");
        });
      });

      it('should get all users', () => {
        return withAuth(chai.request(app).get('/api/users/'), token)
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
          role:       "admin"
        }
      };

      it('user should exist', () => {
        return withAuth(chai.request(app).post('/api/users'), token)
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
          expect(user.role).to.eq("admin");
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
          role:       "admin"
        }
      };

      it('user should have changed', () => {
        return withAuth(chai.request(app).put('/api/users/1'), token)
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
          expect(user.role).to.eq("admin");
        });
      });
    });
  });
});
