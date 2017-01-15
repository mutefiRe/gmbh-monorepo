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

describe('/order route', () => {
  before(clean);
  describe('orders exists', () => {

    before(() => {
      return db.User.create({username: "test1", firstname: "test1", lastname: "test1", password: "test1", permission: 0})
      .then(() => db.Unit.create({name: "unit1"}))
      .then(() => db.Category.create({
        name:        "category",
        enabled:     true,
        description: "newCategory",
        icon:        null,
        showAmount:  true,
        printer:     null
      }))
      .then(() => db.Item.create({
        name:       "item",
        amount:     0.5,
        price:      3.5,
        tax:        0.1,
        sort:       null,
        categoryId: 1,
        unitId:     1
      }))
      .then(() => db.Table.create({
        name: "table",
        x:    1,
        y:    1,
        areaId: null
      }))
      .then(() => db.Order.create({
        totalAmount: 10.5,
        tableId: 1,
        userId:  1
      }))
      .then(() => db.Order.create({
        totalAmount: 4,
        tableId: 1,
        userId:  1
      }))
      .then(() => db.Orderitem.create({
        extras:    "extras",
        count:     3,
        countFree: 0,
        countPaid: 0,
        price:     3.5,
        itemId:    1,
        orderId:   1
      }))
      .then(() => db.Orderitem.create({
        extras:    null,
        count:     2,
        countFree: 0,
        countPaid: 0,
        price:     5,
        itemId:    1,
        orderId:   2
      }));
    });

    describe('GET orders', () => {
      const expectedResponse = {
        "orders": [{
          id:          1,
          totalAmount: 10.5,
          tableId:       1,
          userId:        1,
          orderitems: [{
            id:        1,
            extras:    "extras",
            count:     3,
            countFree: 0,
            countPaid: 0,
            price:     3.5,
            itemId:      1,
            orderId:     1
          }]
        }, {
          id:          2,
          totalAmount: 10.5,
          table:       1,
          user:        1,
          orderitems: [{
            id:        2,
            extras:    null,
            count:     3,
            countFree: 0,
            countPaid: 0,
            price:     3.5,
            itemId:      1,
            orderId:     1
          }]
        }]
      };

      it('should get one order', () => {
        return chai.request(app)
        .get('/api/orders/1')
        .send({ token })
        .then(res => {
          expect(res.status).to.equal(200);
          removeTimestamps(res.body.order.orderitems);
          expect(removeTimestamps(res.body.order.orderitems[0])).to.deep.equal(expectedResponse.orders[0].orderitems[0]);
          expect(res.body.order.id).to.equal(1);
          expect(res.body.order.userId).to.equal(1);
          expect(res.body.order.tableId).to.equal(1);
        });
      });

      it('should get all orders', () => {
        return chai.request(app)
        .get('/api/orders/')
        .send({ token })
        .then(res => {
          expect(removeTimestamps(res.body.orders[0].orderitems)).to.deep.equal(expectedResponse.orders[0].orderitems);
          expect(res.body.orders[0].id).to.equal(1);
          expect(res.body.orders[0].userId).to.equal(1);
          expect(res.body.orders[0].tableId).to.equal(1);
        });
      });
    });

    describe('POST order', () => {
      const requestBody = {
        order: {
          totalAmount: 15.0,
          tableId:     1,
          userId:      1,
          orderitems:  [{
            extras:    null,
            count:     3,
            countFree: 0,
            countPaid: 1,
            price:     3.5,
            itemId:    1,
            orderId:   1
          }]
        }
      };

      const expectedResponse = {
        order: {
          id:          3,
          totalAmount: 15.0,
          tableId:     1,
          userId:      1,
          orderitems: [{
            id:        3,
            extras:    null,
            count:     3,
            countFree: 0,
            countPaid: 1,
            price:     3.5,
            itemId:    1,
            orderId:   3
          }]
        }
      };

      it('order should exist', () => {
        return chai.request(app)
        .post('/api/orders')
        .set("x-access-token", token)
        .send(requestBody)
        .then(res => {
          expect(res.status).to.equal(200);
          removeTimestamps(res.body.order.orderitems);
          expect(removeTimestamps(res.body)).to.deep.equal(expectedResponse);
          return db.Order.find({where: {id: 3}});
        }).then(order => {
          expect(order).not.to.be.null;
          expect(order.totalAmount).to.eq(15);
        });
      });
    });

    describe('PUT order', () => {
      const requestBody = {
        order: {
          id:          1,
          totalAmount: 0.0,
          tableId:     1,
          userId:      1,
          orderitems: [{
            id:        1,
            extras:    null,
            count:     3,
            countFree: 0,
            countPaid: 3,
            price:     3.5,
            itemId:    1,
            orderId:   1
          }]
        }
      };

      const expectedResponse = {
        order: {
          id:          1,
          totalAmount: 0.0,
          tableId:     1,
          userId:      1,
          orderitems: [{
            id:        1,
            extras:    null,
            count:     3,
            countFree: 0,
            countPaid: 3,
            price:     3.5,
            itemId:    1,
            orderId:   1
          }]
        }
      };

      it('order should have changed', () => {
        return chai.request(app)
        .put('/api/orders/1')
        .set("x-access-token", token)
        .send(requestBody)
        .then(res => {
          expect(res.status).to.equal(200);
          removeTimestamps(res.body.order.orderitems);
          expect(removeTimestamps(res.body)).to.deep.equal(expectedResponse);
          return db.Order.find({where: {id: 1}});
        }).then(order => {
          expect(order).not.to.be.null;
          expect(order.totalAmount).to.eq(0);
        });
      });
    });
  });
});
