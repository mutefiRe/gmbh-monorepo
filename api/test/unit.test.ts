'use strict';

const chai     = require('chai');
const expect   = chai.expect;
const app = require('../server');
const db       = require('../models/index');
const chaiHttp = require('chai-http');
const jwt      = require('jsonwebtoken');
const config = require('../config/config');

const { clean, removeTimestamps, getEventId, withAuth } = require('./helper');

chai.use(chaiHttp);


const token = jwt.sign({
  id:         1,
  username:   "test1",
  firstname:  "test1",
  lastname:   "test1",
  role: "admin"
}, config.secret, { expiresIn: '24h' });

describe('/unit route', () => {
  let eventId;
  before(async () => {
    await clean();
    eventId = getEventId();
  });
  describe('units exists', () => {
    before(() => {
      return db.Unit.bulkCreate([
        {id: "1", name: "stk", eventId},
        {id: "2", name: "l", eventId}
      ]);
    });

    describe('GET units', () => {
      const expectedResponse = {
        "units": [{
          id: "1",
          name: "stk",
          eventId
        }, {
          id: "2",
          name: "l",
          eventId
        }]
      };

      it('should get one user', () => {
        return withAuth(chai.request(app).get('/api/units/1'), token, eventId)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.unit.name).to.equal("stk");
        });
      });

      it('should get all units', () => {
        return withAuth(chai.request(app).get('/api/units/'), token, eventId)
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
        return withAuth(chai.request(app).post('/api/units'), token, eventId)
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
        return withAuth(chai.request(app).put('/api/units/1'), token, eventId)
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
