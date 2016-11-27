'use strict';

const chai = require('chai');
const app = require('../server.js');
const chaiHttp = require('chai-http');
const jwt    = require('jsonwebtoken');
const config = require('../config/config.js');

const expect = chai.expect;
chai.use(chaiHttp);

describe('/api route -> check restriction access', () => {

  const token = jwt.sign({
    username: "test",
    firstname: "test",
    lastname: "test",
    permission: 1
  }, config.secret, { expiresIn: '24h' });

  it('should response status 200 to api call, when send with token', () => {
    return chai.request(app)
    .get('/api/')
    .send({ token })
    .then(res => {
      expect(res.status).to.equal(200);
      expect(res.body.msg).equal("you have access to the api");
    });
  });

  it('should response status 400 to api call, when send with wrong token', () => {
    return chai.request(app)
    .get('/api/')
    .send({ token: token + 1 })
    .catch(res => {
      expect(res.status).equal(400);
      expect(res.response).to.be.json;
      expect(res.response.text).to.contain("invalid signature");
    });
  });

  it('should response status 400 to api call, when send without token', () => {
    return chai.request(app)
    .get('/api/')
    .send({})
    .catch(res => {
      expect(res.status).to.equal(400);
      expect(res.response).to.be.json;
      expect(res.response.text).to.contain('No token provided');
    });
  });

  it('should response status 400 to api call, when send with expired token', () => {
    const expiredToken = jwt.sign({
      username: "test",
      firstname: "test",
      lastname: "test",
      permission: 1
    }, config.secret, { expiresIn: '0' });

    return chai.request(app)
    .get('/api/')
    .send({ token: expiredToken })
    .catch(res => {
      expect(res.status).to.equal(400);
      expect(res.response).to.be.json;
      expect(res.response.text).to.contain("jwt expired");
    });
  });
});
