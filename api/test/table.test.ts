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
    before(() => {
      return db.Area.create({id: 1, name: "area1", short: "A", eventId})
      .then(() => db.Table.bulkCreate([
          {id: 1, name: "test1", x: 1, y: 1, areaId: "1", eventId},
          {id: 2, name: "test2", x: 2, y: 2, areaId: "1", enabled: false, eventId}]
      ));
    });

    describe('GET tables', () => {
      const expectedResponse = {
        "tables": [
          {id: "1", name: "test1", x: 1, y: 1, areaId: "1", custom: false, enabled: true, eventId },
          {id: "2", name: "test2", x: 2, y: 2, areaId: "1", custom: false, enabled: false, eventId}
        ]
      };

      it('should get one table', () => {
        return withAuth(chai.request(app).get('/api/tables/1'), token, eventId)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.table.name).to.equal("test1");
        });
      });

      it('should get all tables', () => {
        return withAuth(chai.request(app).get('/api/tables/'), token, eventId)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(removeTimestamps(res.body)).to.deep.equal(expectedResponse);
        });
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

      it('table should exist', () => {
        return withAuth(chai.request(app).post('/api/tables'), token, eventId)
        .send(requestBody)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.table.name).to.equal("newTable");
          return db.Table.find({where: {name: "newTable"}});
        }).then(table => {
          expect(table).not.to.be.null;
          expect(table.name).to.eq("newTable");
          expect(table.areaId).to.eq("1");
          expect(table.x).to.eq(3);
          expect(table.y).to.eq(3);
        });
      });
    });

    describe('PUT table', () => {
      const requestBody = {
        table: {name: "changedTable", x: 4, y: 4, areaId: "1", enabled: false}
      };

      it('table should have changed', () => {
        return withAuth(chai.request(app).put('/api/tables/1'), token, eventId)
        .send(requestBody)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.table.name).to.equal("changedTable");
          return db.Table.find({where: {name: "changedTable"}});
        }).then(table => {
          expect(table).not.to.be.null;
          expect(table.name).to.eq("changedTable");
          expect(table.areaId).to.eq("1");
          expect(table.enabled).to.eq(false);
          expect(table.x).to.eq(4);
          expect(table.y).to.eq(4);
        });
      });
    });
  });
});
