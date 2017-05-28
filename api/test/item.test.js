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
  role: "admin"
}, config.secret, { expiresIn: '24h' });

describe('/item route', () => {
  before(clean);
  describe('items exists', () => {

    before(() => {
      return db.Category.create({
        id:          1,
        name:        "category1",
        enabled:     true,
        description: "newCategory",
        icon:        null,
        showAmount:  true,
        printer:     null
      })
      .then(() => db.Unit.create({id: 1, name: "unit1"}))
      .then(() => db.Item.bulkCreate([{
        id:         "1",
        name:       "item1",
        amount:     0.5,
        price:      3.5,
        tax:        0.1,
        group:      null,
        categoryId: "1",
        unitId:     "1"
      }, {
        id:         "2",
        name:       "item2",
        amount:     0.5,
        price:      3.5,
        tax:        0.1,
        group:      null,
        categoryId: "1",
        unitId:     "1"
      }]));
    });

    describe('GET items', () => {
      const expectedResponse = {
        "items": [{
          id:         "1",
          name:       "item1",
          amount:     0.5,
          price:      3.5,
          tax:        0.1,
          group:       null,
          categoryId: "1",
          unitId:     "1",
          enabled:    true
        }, {
          id:         "2",
          name:       "item2",
          amount:     0.5,
          price:      3.5,
          tax:        0.1,
          group:       null,
          categoryId: "1",
          unitId:     "1",
          enabled:    true
        }]
      };

      it('should get one item', () => {
        return chai.request(app)
        .get('/api/items/1')
        .send({ token })
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.item.name).to.equal("item1");
        });
      });

      it('should get all items', () => {
        return chai.request(app)
        .get('/api/items/')
        .send({ token })
        .then(res => {
          expect(removeTimestamps(res.body)).to.deep.equal(expectedResponse);
        });
      });
    });

    describe('POST item', () => {
      const requestBody = {
        item: {
          name:       "newItem",
          amount:     0.5,
          price:      3.5,
          tax:        0.1,
          group:       null,
          categoryId: "1",
          unitId:     "1"
        }
      };

      it('item should exist', () => {
        return chai.request(app)
        .post('/api/items')
        .set("x-access-token", token)
        .send(requestBody)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.item.name).to.equal("newItem");
          return db.Item.find({where: {name: "newItem"}});
        }).then(item => {
          expect(item).not.to.be.null;
          expect(item.name).to.eq("newItem");
        });
      });
    });

    describe('PUT item', () => {
      const requestBody = {
        item: {
          name:       "changedItem",
          amount:     0.5,
          price:      3.5,
          tax:        0.1,
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
          tax:        0.1,
          group:       null,
          categoryId: "1",
          unitId:     "1",
          enabled:    false
        }
      };

      it('item should have changed', () => {
        return chai.request(app)
        .put('/api/items/1')
        .set("x-access-token", token)
        .send(requestBody)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(removeTimestamps(res.body)).to.deep.equal(expectedResponse);
          return db.Item.find({where: {name: "changedItem"}});
        }).then(item => {
          expect(item).not.to.be.null;
          expect(item.name).to.eq("changedItem");
        });
      });
    });
  });
});

