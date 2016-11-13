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

describe('/category route', () => {
  before(done => {
    clean(done);
  });
  describe('categories exists', () => {

    before(done => {
      db.Category.bulkCreate([{
        name:        "category1",
        enabled:     true,
        description: "newCategory",
        icon:        null,
        showAmount:  true,
        printer:     null
      }, {
        name:        "category2",
        enabled:     false,
        description: "newCategory",
        icon:        "icon.jpg",
        showAmount:  false,
        printer:     "kitchen"
      }]).then(() => {
        return db.Item.create({
          name:       "Bier",
          amount:     0.5,
          price:      3.5,
          tax:        0.2,
          unitId:     null,
          categoryId: 1
        });
      }).then(() => {
        done();
      }).catch(error => {
        done(error);
      });
    });

    describe('GET categories', () => {
      const expectedResponse = {
        "categories": [{
          id:          1,
          name:        "category1",
          enabled:     true,
          description: "newCategory",
          icon:        null,
          showAmount:  true,
          printer:     null,
          category:    null,
          items:       [1]
        }, {
          id:          2,
          name:        "category2",
          enabled:     false,
          description: "newCategory",
          icon:        "icon.jpg",
          showAmount:  false,
          printer:     "kitchen",
          category:    null,
          items:       []
        }]
      };

      it('should get one category', done => {
        chai.request(app)
        .get('/api/categories/1')
        .send({ token })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(removeTimestamps(res.body)).to.deep.equal({category: expectedResponse.categories[0]});
          done();
        });
      });

      it('should get all categories', done => {
        chai.request(app)
        .get('/api/categories')
        .send({ token })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(removeTimestamps(res.body)).to.deep.equal(expectedResponse);
          done();
        });
      });
    });

    describe('POST category', () => {
      const requestBody = {
        category: {
          name:        "newCategory",
          enabled:     true,
          description: "newCategory",
          icon:        null,
          showAmount:  true,
          printer:     null
        }
      };

      it('category should exist', done => {
        chai.request(app)
        .post('/api/categories')
        .set("x-access-token", token)
        .send(requestBody)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.category.name).to.equal("newCategory");
          return db.Category.find({where: {name: "newCategory"}});
        }).then(category => {
          expect(category).not.to.be.null;
          expect(category.name).to.eq("newCategory");
          done();
        }).catch(err => done(err));
      });
    });

    describe('PUT category', () => {
      const requestBody = {
        category: {
          name:        "changedCategory",
          enabled:     false,
          description: "changedCategory",
          icon:        "icon.jpg",
          showAmount:  true,
          printer:     "kitchen",
          category:    2
        }
      };

      const expectedResponse = {
        category: {
          id:          1,
          name:        "changedCategory",
          enabled:     false,
          description: "changedCategory",
          icon:        "icon.jpg",
          showAmount:  true,
          printer:     "kitchen",
          category:    2
        }
      };

      it('category should have changed', done => {
        chai.request(app)
        .put('/api/categories/1')
        .set("x-access-token", token)
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
          done();
        }).catch(err => done(err));
      });
    });
  });
});

