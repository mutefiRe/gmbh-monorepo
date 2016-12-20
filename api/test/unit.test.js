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

describe('/unit route', () => {
  before(clean);
  describe('units exists', () => {
    before(() => {
      return db.Unit.bulkCreate([{name: "stk"}, {name: "l"}]);
    });

    describe('GET units', () => {
      const expectedResponse = {
        "units": [{
          id: 1,
          name: "stk"
        }, {
          id: 2,
          name: "l"
        }]
      };

      it('should get one user', () => {
        return chai.request(app)
        .get('/api/units/1')
        .send({ token })
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.unit.name).to.equal("stk");
        });
      });

      it('should get all units', () => {
        return chai.request(app)
        .get('/api/units/')
        .send({ token })
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.units.length).to.equal(2);
          expect(removeTimestamps(res.body)).to.deep.equal(expectedResponse);
        });
      });
    });

    describe('POST unit', () => {
      const requestBody = {
        unit: {
          name: "cl"
        }
      };

      it('unit should exist', () => {
        return chai.request(app)
        .post('/api/units')
        .set("x-access-token", token)
        .send(requestBody)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.unit.name).to.equal("cl");
          return db.Unit.find({where: {name: "cl"}});
        }).then(unit => {
          expect(unit).not.to.be.null;
          expect(unit.name).to.eq("cl");
        });
      });
    });

    describe('PUT unit', () => {
      const requestBody = {
        unit: {
          name: "ml"
        }
      };

      it('unit should have changed', () => {
        return chai.request(app)
        .put('/api/units/1')
        .set("x-access-token", token)
        .send(requestBody)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.unit.name).to.equal("ml");
          return db.Unit.find({where: {name: "ml"}});
        }).then(unit => {
          expect(unit).not.to.be.null;
          expect(unit.name).to.eq("ml");
        });
      });
    });
  });
});

