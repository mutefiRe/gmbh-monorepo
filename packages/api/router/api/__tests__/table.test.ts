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
  tablename:   "test1",
  firstname:  "test1",
  lastname:   "test1",
  role: "admin"
}, config.secret, { expiresIn: '24h' });

describe('/table route', () => {
  let eventId;
  before(async () => {
    await clean();
    eventId = getEventId();
  });
  describe('tables exists', () => {
    before(async () => {
      await db.Area.create({id: 1, name: "area1", short: "A", eventId});
      await db.Table.bulkCreate([
        {id: 1, name: "test1", x: 1, y: 1, areaId: "1", eventId},
        {id: 2, name: "test2", x: 2, y: 2, areaId: "1", enabled: false, eventId}
      ]);
    });

    describe('GET tables', () => {
      const expectedResponse = {
        "tables": [
          {id: "1", name: "test1", x: 1, y: 1, areaId: "1", custom: false, enabled: true, eventId },
          {id: "2", name: "test2", x: 2, y: 2, areaId: "1", custom: false, enabled: false, eventId}
        ]
      };

      it('should get one table', async () => {
        const res = await requestJson({ path: '/api/tables/1', token, eventId });
        assert.equal(res.status, 200);
        assert.equal(res.body.table.name, "test1");
      });

      it('should get all tables', async () => {
        const res = await requestJson({ path: '/api/tables/', token, eventId });
        assert.equal(res.status, 200);
        assert.deepEqual(removeTimestamps(res.body), expectedResponse);
      });
    });

    describe('POST table', () => {
      const requestBody = {
        table: {
          name: "newTable",
          areaId: "1",
          x:      3,
          y:      3,
          custom: false
        }
      };

      it('table should exist', async () => {
        const res = await requestJson({ method: 'POST', path: '/api/tables', token, eventId, body: requestBody });
        assert.equal(res.status, 200);
        assert.equal(res.body.table.name, "newTable");
        const table = await db.Table.find({where: {name: "newTable"}});
        assert.notEqual(table, null);
        assert.equal(table.name, "newTable");
        assert.equal(table.areaId, "1");
        assert.equal(table.x, 3);
        assert.equal(table.y, 3);
      });
    });

    describe('PUT table', () => {
      const requestBody = {
        table: {name: "changedTable", x: 4, y: 4, areaId: "1", enabled: false}
      };

      it('table should have changed', async () => {
        const res = await requestJson({ method: 'PUT', path: '/api/tables/1', token, eventId, body: requestBody });
        assert.equal(res.status, 200);
        assert.equal(res.body.table.name, "changedTable");
        const table = await db.Table.find({where: {name: "changedTable"}});
        assert.notEqual(table, null);
        assert.equal(table.name, "changedTable");
        assert.equal(table.areaId, "1");
        assert.equal(table.enabled, false);
        assert.equal(table.x, 4);
        assert.equal(table.y, 4);
      });
    });
  });
});
