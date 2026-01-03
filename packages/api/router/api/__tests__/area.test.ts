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
  role:       "admin"
}, config.secret, { expiresIn: '24h' });

describe('/area route', () => {
  let eventId;
  before(async () => {
    await clean();
    eventId = getEventId();
  });
  describe('areas exists', () => {
    before(() => {
      return db.Area.bulkCreate([
        {id: 1, name: "area1", enabled: false,  short: "A", eventId},
        {id: 2, name: "area2", color:   "blue", short: "B", eventId}
      ]);
    });

    describe('GET areas', () => {
      const expectedResponse = {
        "areas": [{
          id:     "1",
          name:   "area1",
          short:  "A",
          tables: [],
          users:  [],
          color:  null,
          enabled: false,
          eventId
        }, {
          id:     "2",
          name:   "area2",
          short:  "B",
          tables: [],
          users:  [],
          color:  "blue",
          enabled: true,
          eventId

        }]
      };

      it('should get one area', async () => {
        const res = await requestJson({ path: '/api/areas/1', token, eventId });
        assert.equal(res.status, 200);
        assert.equal(res.body.area.name, "area1");
      });

      it('should get all areas', async () => {
        const res = await requestJson({ path: '/api/areas/', token, eventId });
        assert.equal(res.status, 200);
        assert.equal(res.body.areas.length, 2);
        assert.deepEqual(removeTimestamps(res.body), expectedResponse);
      });
    });

    describe('POST area', () => {
      const requestBody = {
        area: {
          name:  "newArea",
          short: "c"
        }
      };

      it('area should exist', async () => {
        const res = await requestJson({ method: 'POST', path: '/api/areas', token, eventId, body: requestBody });
        assert.equal(res.status, 200);
        assert.equal(res.body.area.name, "newArea");
        const area = await db.Area.find({where: {name: "newArea"}});
        assert.notEqual(area, null);
        assert.equal(area.name, "newArea");
      });
    });

    describe('PUT area', () => {
      const requestBody = {
        area: {
          name: "changedArea"
        }
      };

      it('area should have changed', async () => {
        const res = await requestJson({ method: 'PUT', path: '/api/areas/1', token, eventId, body: requestBody });
        assert.equal(res.status, 200);
        assert.equal(res.body.area.name, "changedArea");
        const area = await db.Area.find({where: {name: "changedArea"}});
        assert.notEqual(area, null);
        assert.equal(area.name, "changedArea");
      });
    });
  });
});
