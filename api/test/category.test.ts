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

describe('/category route', () => {
  let eventId;
  before(async () => {
    await clean();
    eventId = getEventId();
  });
  describe('categories exists', () => {
    const printer1 = "277056cb-b639-4365-9532-563ca57d714d";
    const printer2 = "a0470f0b-6e43-4773-895d-72bc08c19439";
    before(() => {
      return db.Printer.bulkCreate([{
        id: printer1,
        systemName: "test"
      },{
        id: printer2,
        systemName: "test2"
      }])
      .then(() => {
        return db.Category.bulkCreate([{
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
        }])
        .then(() => db.Item.create({
          id:         1,
          name:       "Bier",
          amount:     0.5,
          price:      3.5,
          tax:        0.2,
          unitId:     null,
          eventId
        }));
      })
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

      it('should get one category', () => {
        return withAuth(chai.request(app).get('/api/categories/1'), token, eventId)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(removeTimestamps(res.body)).to.deep.equal({category: expectedResponse.categories[0]});
        });
      });

      it('should get all categories', () => {
        return withAuth(chai.request(app).get('/api/categories'), token, eventId)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(removeTimestamps(res.body)).to.deep.equal(expectedResponse);
        });
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

      it('category should exist', () => {
        return withAuth(chai.request(app).post('/api/categories'), token, eventId)
        .send(requestBody)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.category.name).to.equal("newCategory");
          return db.Category.find({where: {name: "newCategory"}});
        }).then(category => {
          expect(category).not.to.be.null;
          expect(category.name).to.eq("newCategory");
        });
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

      it('category should have changed', () => {
        return withAuth(chai.request(app).put('/api/categories/1'), token, eventId)
        .send(requestBody)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.category.name).to.equal("changedCategory");
          expect(removeTimestamps(res.body)).to.deep.eq(expectedResponse);
          return db.Category.find({where: {name: "changedCategory"}});
        }).then(category => {
          expect(category).not.to.be.null;
          expect(category.name).to.eq("changedCategory");
          expect(category.enabled).to.eq(false);
        });
      });
    });
  });
});
