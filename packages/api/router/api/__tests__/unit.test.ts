'use strict';

const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');

require('../../../server');
const db = require('../../../models/index');
const jwt = require('jsonwebtoken');
const config = require('../../../config/config');

const { clean, removeTimestamps, getEventId, requestJson } = require('../../../__tests__/helper');


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

      it('should get one user', async () => {
        const res = await requestJson({ path: '/api/units/1', token, eventId });
        assert.equal(res.status, 200);
        assert.equal(res.body.unit.name, "stk");
      });

      it('should get all units', async () => {
        const res = await requestJson({ path: '/api/units/', token, eventId });
        assert.equal(res.status, 200);
        assert.equal(res.body.units.length, 2);
        assert.deepEqual(removeTimestamps(res.body), expectedResponse);
      });
    });

    describe('POST unit', () => {
      const requestBody = {
        unit: {
          name: "cl"
        }
      };

      it('unit should exist', async () => {
        const res = await requestJson({ method: 'POST', path: '/api/units', token, eventId, body: requestBody });
        assert.equal(res.status, 200);
        assert.equal(res.body.unit.name, "cl");
        const unit = await db.Unit.find({where: {name: "cl"}});
        assert.notEqual(unit, null);
        assert.equal(unit.name, "cl");
      });
    });

    describe('PUT unit', () => {
      const requestBody = {
        unit: {
          name: "ml"
        }
      };

      it('unit should have changed', async () => {
        const res = await requestJson({ method: 'PUT', path: '/api/units/1', token, eventId, body: requestBody });
        assert.equal(res.status, 200);
        assert.equal(res.body.unit.name, "ml");
        const unit = await db.Unit.find({where: {name: "ml"}});
        assert.notEqual(unit, null);
        assert.equal(unit.name, "ml");
      });
    });
  });
});
