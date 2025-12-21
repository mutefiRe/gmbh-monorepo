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

describe('/order route', () => {
  let eventId;
  before(async () => {
    await clean();
    eventId = getEventId();
  });
  describe('orders exists', () => {

    before(async () => {
      await db.User.create({id: 1, username: "test1", firstname: "test1", lastname: "test1", password: "test1", role: "admin"});
      await db.Unit.create({id: 1, name: "unit1", eventId});
      await db.Category.create({
        id:          1,
        name:        "category",
        enabled:     true,
        description: "newCategory",
        icon:        null,
        showAmount:  true,
        printer:     null,
        eventId
      });
      await db.Item.create({
        id:         1,
        name:       "item",
        amount:     0.5,
        price:      3.5,
        sort:       null,
        categoryId: 1,
        unitId:     1,
        eventId
      });
      await db.Table.create({
        id:   1,
        name: "table",
        x:    1,
        y:    1,
        areaId: null,
        eventId
      });
      await db.Order.create({
        id:          1,
        tableId:     1,
        userId:      1,
        eventId
      });
      await db.Order.create({
        id:          2,
        tableId:     1,
        userId:      1,
        eventId
      });
      await db.Orderitem.create({
        id:        1,
        extras:    "extras",
        count:     3,
        countFree: 0,
        countPaid: 0,
        price:     3.5,
        itemId:    1,
        orderId:   1
      });
      await db.Orderitem.create({
        id:        2,
        extras:    null,
        count:     2,
        countFree: 0,
        countPaid: 0,
        price:     5,
        itemId:    1,
        orderId:   2
      });
    });

    describe('GET orders', () => {
      const expectedResponse = {
        "orders": [{
          id:          "1",
          number:      1,
          totalAmount: 10.5,
          printCount:  0,
          tableId:       "1",
          userId:        "1",
          eventId,
          orderitems: [{
            id:        "1",
            extras:    "extras",
            count:     3,
            countFree: 0,
            countPaid: 0,
            price:     3.5,
            itemId:      "1",
            orderId:     "1"
          }]
        }, {
          id:          "2",
          totalAmount: 10.5,
          printCount:  0,
          tableId:       "1",
          userId:        "1",
          eventId,
          orderitems: [{
            id:        "2",
            extras:    null,
            count:     3,
            countFree: 0,
            countPaid: 0,
            price:     3.5,
            itemId:      "1",
            orderId:     "1"
          }]
        }]
      };

      it('should get one order', async () => {
        const res = await requestJson({ path: '/api/orders/1', token, eventId });
        assert.equal(res.status, 200);
        removeTimestamps(res.body.order);
        assert.deepEqual(res.body.order.orderitems[0], expectedResponse.orders[0].orderitems[0]);
        assert.equal(res.body.order.id, '1');
        assert.equal(res.body.order.userId, '1');
        assert.equal(res.body.order.tableId, '1');
      });

      it('should get all orders', async () => {
        const res = await requestJson({ path: '/api/orders/', token, eventId });
        assert.deepEqual(removeTimestamps(res.body.orders[0].orderitems), expectedResponse.orders[0].orderitems);
        assert.equal(res.body.orders[0].id, '1');
        assert.equal(res.body.orders[0].userId, '1');
        assert.equal(res.body.orders[0].tableId, '1');
      });
    });

    describe('POST order', () => {
      const requestBody = {
        order: {
          id:          "5",
          totalAmount: 15.0,
          tableId:     "1",
          userId:      "1",
          orderitems:  [{
            id:        "10",
            extras:    null,
            count:     3,
            countFree: 0,
            countPaid: 1,
            price:     3.5,
            itemId:    "1",
            orderId:   "1"
          }]
        }
      };

      const expectedResponse = {
        order: {
          id:          "5",
          number:      3,
          totalAmount: 15.0,
          printCount:  0,
          tableId:     "1",
          userId:      "1",
          eventId,
          orderitems: [{
            id:        "10",
            extras:    null,
            count:     3,
            countFree: 0,
            countPaid: 1,
            price:     3.5,
            itemId:    "1",
            orderId:   "5"
          }]
        }
      };

      it('order should exist', async () => {
        const res = await requestJson({ method: 'POST', path: '/api/orders', token, eventId, body: requestBody });
        assert.equal(res.status, 200);
        removeTimestamps(res.body.order.orderitems);
        assert.deepEqual(removeTimestamps(res.body), expectedResponse);
        const order = await db.Order.find({where: {id: "5"}});
        assert.notEqual(order, null);
        assert.equal(order.totalAmount, 15);
      });
    });

    describe('PUT order', () => {
      const requestBody = {
        order: {
          id:          "1",
          totalAmount: 0.0,
          tableId:     "1",
          userId:      "1",
          orderitems: [{
            id:        "1",
            extras:    null,
            count:     3,
            countFree: 0,
            countPaid: 3,
            price:     3.5,
            itemId:    "1",
            orderId:   "1"
          }]
        }
      };

      const expectedResponse = {
        order: {
          id:          "1",
          number:      1,
          totalAmount: 0.0,
          printCount:  0,
          tableId:     "1",
          userId:      "1",
          eventId,
          orderitems: [{
            id:        "1",
            extras:    null,
            count:     3,
            countFree: 0,
            countPaid: 3,
            price:     3.5,
            itemId:    "1",
            orderId:   "1"
          }]
        }
      };

      it('order should have changed', async () => {
        const res = await requestJson({ method: 'PUT', path: '/api/orders/1', token, eventId, body: requestBody });
        assert.equal(res.status, 200);
        removeTimestamps(res.body.order.orderitems);
        assert.deepEqual(removeTimestamps(res.body), expectedResponse);
        const order = await db.Order.find({where: {id: 1}});
        assert.notEqual(order, null);
        assert.equal(order.totalAmount, 0);
      });
    });
  });
});
