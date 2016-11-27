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

describe('/area route', () => {
  before(done => {
    clean(done);
  });
  describe('areas exists', () => {

    before(done => {
      db.Area.bulkCreate([{name: "area1"}, {name: "area2"}])
      .then(() => {
        done();
      }).catch(error => {
        done(error);
      });
    });

    describe('GET areas', () => {
      const expectedResponse = {
        "areas": [{
          id:     1,
          name:   "area1",
          tables: [],
          users:  []
        }, {
          id:     2,
          name:   "area2",
          tables: [],
          users:  []
        }]
      };

      it('should get one area', done => {
        chai.request(app)
        .get('/api/areas/1')
        .send({ token })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.area.name).to.equal("area1");
          done();
        });
      });

      it('should get all areas', done => {
        chai.request(app)
        .get('/api/areas/')
        .send({ token })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.areas.length).to.equal(2);
          expect(removeTimestamps(res.body)).to.deep.equal(expectedResponse);
          done();
        });
      });
    });

    describe('POST area', () => {
      const requestBody = {
        area: {
          name: "newArea"
        }
      };

      it('area should exist', done => {
        chai.request(app)
        .post('/api/areas')
        .set("x-access-token", token)
        .send(requestBody)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.area.name).to.equal("newArea");
          return db.Area.find({where: {name: "newArea"}});
        }).then(area => {
          expect(area).not.to.be.null;
          expect(area.name).to.eq("newArea");
          done();
        }).catch(err => done(err));
      });
    });

    describe('PUT area', () => {
      const requestBody = {
        area: {
          name: "changedArea"
        }
      };

      it('area should have changed', done => {
        chai.request(app)
        .put('/api/areas/1')
        .set("x-access-token", token)
        .send(requestBody)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.area.name).to.equal("changedArea");
          return db.Area.find({where: {name: "changedArea"}});
        }).then(area => {
          expect(area).not.to.be.null;
          expect(area.name).to.eq("changedArea");
          done();
        }).catch(err => done(err));
      });
    });
  });
});

