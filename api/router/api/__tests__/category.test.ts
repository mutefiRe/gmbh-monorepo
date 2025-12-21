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

describe('/category route', () => {
  let eventId;
  before(async () => {
    await clean();
    eventId = getEventId();
  });
  describe('categories exists', () => {
    const printer1 = "277056cb-b639-4365-9532-563ca57d714d";
    const printer2 = "a0470f0b-6e43-4773-895d-72bc08c19439";
    before(async () => {
      await db.Printer.bulkCreate([{
        id: printer1,
        systemName: "test"
      },{
        id: printer2,
        systemName: "test2"
      }]);
      await db.Category.bulkCreate([{
        id:          1,
        name:        "category1",
        enabled:     true,
        icon:        null,
        showAmount:  true,
        printerId:   null,
        eventId
      }, {
        id:          2,
        name:        "category2",
        enabled:     false,
        icon:        "icon.jpg",
        showAmount:  false,
        printerId:   printer1,
        color:       "red",
        eventId
      }]);
      await db.Item.create({
        id:         1,
        name:       "Bier",
        amount:     0.5,
        price:      3.5,
        unitId:     null,
        eventId
      });
    });

    describe('GET categories', () => {
      const expectedResponse = {
        "categories": [{
          id:          "1",
          name:        "category1",
          enabled:     true,
          icon:        null,
          showAmount:  true,
          printerId:     null,
          categoryId:  null,
          color:       null,
          eventId
        }, {
          id:          "2",
          name:        "category2",
          enabled:     false,
          icon:        "icon.jpg",
          showAmount:  false,
          printerId:   printer1,
          categoryId:  null,
          color:       "red",
          eventId
        }]
      };

      it('should get one category', async () => {
        const res = await requestJson({ path: '/api/categories/1', token, eventId });
        assert.equal(res.status, 200);
        assert.deepEqual(removeTimestamps(res.body), {category: expectedResponse.categories[0]});
      });

      it('should get all categories', async () => {
        const res = await requestJson({ path: '/api/categories', token, eventId });
        assert.equal(res.status, 200);
        assert.deepEqual(removeTimestamps(res.body), expectedResponse);
      });
    });

    describe('POST category', () => {
      const requestBody = {
        category: {
          name:        "newCategory",
          enabled:     true,
          icon:        null,
          showAmount:  true,
          printerId:     null
        }
      };

      it('category should exist', async () => {
        const res = await requestJson({ method: 'POST', path: '/api/categories', token, eventId, body: requestBody });
        assert.equal(res.status, 200);
        assert.equal(res.body.category.name, "newCategory");
        const category = await db.Category.find({where: {name: "newCategory"}});
        assert.notEqual(category, null);
        assert.equal(category.name, "newCategory");
      });
    });

    describe('PUT category', () => {
      const requestBody = {
        category: {
          name:        "changedCategory",
          enabled:     false,
          icon:        "icon.jpg",
          showAmount:  true,
          categoryId:  null,
          printerId:   printer2,
          color:       "#00FF00"
        }
      };

      const expectedResponse = {
        category: {
          id:          "1",
          name:        "changedCategory",
          enabled:     false,
          icon:        "icon.jpg",
          showAmount:  true,
          categoryId:  null,
          printerId:   printer2,
          color:       "#00FF00",
          eventId
        }
      };

      it('category should have changed', async () => {
        const res = await requestJson({ method: 'PUT', path: '/api/categories/1', token, eventId, body: requestBody });
        assert.equal(res.status, 200);
        assert.equal(res.body.category.name, "changedCategory");
        assert.deepEqual(removeTimestamps(res.body), expectedResponse);
        const category = await db.Category.find({where: {name: "changedCategory"}});
        assert.notEqual(category, null);
        assert.equal(category.name, "changedCategory");
        assert.equal(category.enabled, false);
      });
    });
  });
});
