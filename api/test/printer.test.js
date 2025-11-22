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
      it('should get all printers', () => {
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
        return chai.request(app)
        .get('/api/printers')
        .send({ token })
        .then(res => {
          expect(res.status).to.equal(200);
          expect(removeTimestamps(res.body)).to.deep.equal(expectedResponse);
        });
      });
    });

    describe('PUT printer', () => {
      it('printer should have changed', () => {
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

        return chai.request(app)
        .put('/api/printers/1')
        .set("x-access-token", token)
        .send(requestBody)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.printer.name).to.equal("Fancy Printer");
          expect(removeTimestamps(res.body)).to.deep.eq(expectedResponse);
          return db.Printer.find({where: {name: "Fancy Printer"}});
        }).then(printer => {
          expect(printer).not.to.be.null;
          expect(printer.name).to.eq("Fancy Printer");
        });
      });
    });
  });
});
