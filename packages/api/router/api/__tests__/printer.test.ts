'use strict';

const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');

require('../../../server');
const db = require('../../../models/index');
const jwt = require('jsonwebtoken');
const config = require('../../../config/config');

const { clean, removeTimestamps, requestJson } = require('../../../__tests__/helper');

const token = jwt.sign({
  id:         1,
  username:   "test1",
  firstname:  "test1",
  lastname:   "test1",
  role:       "admin"
}, config.secret, { expiresIn: '24h' });

describe('/printer route', () => {
  before(clean);
  describe('printer exists', () => {
    before(() => {
      return db.Printer.bulkCreate([{
        id: "1",
        systemName: "test"
      },{
        id: "2",
        systemName: "test2",
        name: "kitchen"
      }]);
    });

    describe('GET printers', () => {
      it('should get all printers', async () => {
        const expectedResponse = {
          printers: [{
            id: "1",
            systemName: "test",
            name: null
          },{
            id: "2",
            systemName: "test2",
            name: "kitchen"
          }]
        };
        const res = await requestJson({ path: '/api/printers', token });
        assert.equal(res.status, 200);
        assert.deepEqual(removeTimestamps(res.body), expectedResponse);
      });
    });

    describe('PUT printer', () => {
      it('printer should have changed', async () => {
        const requestBody = {
          printer: {
            systemName: "test",
            name: "Fancy Printer"
          }
        };

        const expectedResponse = {
          printer: {
            id: "1",
            systemName: "test",
            name: "Fancy Printer"
          }
        };

        const res = await requestJson({ method: 'PUT', path: '/api/printers/1', token, body: requestBody });
        assert.equal(res.status, 200);
        assert.equal(res.body.printer.name, "Fancy Printer");
        assert.deepEqual(removeTimestamps(res.body), expectedResponse);
        const printer = await db.Printer.find({where: {name: "Fancy Printer"}});
        assert.notEqual(printer, null);
        assert.equal(printer.name, "Fancy Printer");
      });
    });
  });
});
