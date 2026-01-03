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

describe('/item route', () => {
  let eventId;
  before(async () => {
    await clean();
    eventId = getEventId();
  });
  describe('items exists', () => {

    before(async () => {
      await db.Category.create({
        id:          1,
        name:        "category1",
        enabled:     true,
        description: "newCategory",
        icon:        null,
        showAmount:  true,
        printer:     null,
        eventId
      });
      await db.Unit.create({id: 1, name: "unit1", eventId });
      await db.Item.bulkCreate([{
        id:         "1",
        name:       "item1",
        amount:     0.5,
        price:      3.5,
        group:      null,
        categoryId: "1",
        unitId:     "1",
        eventId
      }, {
        id:         "2",
        name:       "item2",
        amount:     0.5,
        price:      3.5,
        group:      null,
        categoryId: "1",
        unitId:     "1",
        eventId
      }]);
    });

    describe('GET items', () => {
      const expectedResponse = {
        "items": [{
          id:         "1",
          name:       "item1",
          amount:     0.5,
          price:      3.5,
          group:       null,
          categoryId: "1",
          unitId:     "1",
          enabled:    true,
          eventId
        }, {
          id:         "2",
          name:       "item2",
          amount:     0.5,
          price:      3.5,
          group:       null,
          categoryId: "1",
          unitId:     "1",
          enabled:    true,
          eventId
        }]
      };

      it('should get one item', async () => {
        const res = await requestJson({ path: '/api/items/1', token, eventId });
        assert.equal(res.status, 200);
        assert.equal(res.body.item.name, "item1");
      });

      it('should get all items', async () => {
        const res = await requestJson({ path: '/api/items/', token, eventId });
        assert.deepEqual(removeTimestamps(res.body), expectedResponse);
      });
    });

    describe('POST item', () => {
      const requestBody = {
        item: {
          name:       "newItem",
          amount:     0.5,
          price:      3.5,
          group:       null,
          categoryId: "1",
          unitId:     "1"
        }
      };

      it('item should exist', async () => {
        const res = await requestJson({ method: 'POST', path: '/api/items', token, eventId, body: requestBody });
        assert.equal(res.status, 200);
        assert.equal(res.body.item.name, "newItem");
        const item = await db.Item.find({where: {name: "newItem"}});
        assert.notEqual(item, null);
        assert.equal(item.name, "newItem");
      });
    });

    describe('PUT item', () => {
      const requestBody = {
        item: {
          name:       "changedItem",
          amount:     0.5,
          price:      3.5,
          group:       null,
          categoryId: "1",
          unitId:     "1",
          enabled:    false
        }
      };

      const expectedResponse = {
        item: {
          id:         "1",
          name:       "changedItem",
          amount:     0.5,
          price:      3.5,
          group:       null,
          categoryId: "1",
          unitId:     "1",
          enabled:    false,
          eventId
        }
      };

      it('item should have changed', async () => {
        const res = await requestJson({ method: 'PUT', path: '/api/items/1', token, eventId, body: requestBody });
        assert.equal(res.status, 200);
        assert.deepEqual(removeTimestamps(res.body), expectedResponse);
        const item = await db.Item.find({where: {name: "changedItem"}});
        assert.notEqual(item, null);
        assert.equal(item.name, "changedItem");
      });
    });
  });
});
