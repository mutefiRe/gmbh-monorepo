'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require('chai');
const expect = chai.expect;
const app = require('../server');
const db = require('../models/index');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { clean, removeTimestamps, getEventId, withAuth } = require('./helper');
chai.use(chaiHttp);
const token = jwt.sign({
    id: 1,
    username: "test1",
    firstname: "test1",
    lastname: "test1",
    role: "admin"
}, config.secret, { expiresIn: '24h' });
describe('/area route', () => {
    let eventId;
    before(async () => {
        await clean();
        eventId = getEventId();
    });
    describe('areas exists', () => {
        before(() => {
            return db.Area.bulkCreate([
                { id: 1, name: "area1", enabled: false, short: "A", eventId },
                { id: 2, name: "area2", color: "blue", short: "B", eventId }
            ]);
        });
        describe('GET areas', () => {
            const expectedResponse = {
                "areas": [{
                        id: "1",
                        name: "area1",
                        short: "A",
                        tables: [],
                        users: [],
                        color: null,
                        enabled: false,
                        eventId
                    }, {
                        id: "2",
                        name: "area2",
                        short: "B",
                        tables: [],
                        users: [],
                        color: "blue",
                        enabled: true,
                        eventId
                    }]
            };
            it('should get one area', () => {
                return withAuth(chai.request(app).get('/api/areas/1'), token, eventId)
                    .then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.body.area.name).to.equal("area1");
                });
            });
            it('should get all areas', () => {
                return withAuth(chai.request(app).get('/api/areas/'), token, eventId)
                    .then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.body.areas.length).to.equal(2);
                    expect(removeTimestamps(res.body)).to.deep.equal(expectedResponse);
                });
            });
        });
        describe('POST area', () => {
            const requestBody = {
                area: {
                    name: "newArea",
                    short: "c"
                }
            };
            it('area should exist', () => {
                return withAuth(chai.request(app).post('/api/areas'), token, eventId)
                    .send(requestBody)
                    .then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.body.area.name).to.equal("newArea");
                    return db.Area.find({ where: { name: "newArea" } });
                })
                    .then(area => {
                    expect(area).not.to.be.null;
                    expect(area.name).to.eq("newArea");
                });
            });
        });
        describe('PUT area', () => {
            const requestBody = {
                area: {
                    name: "changedArea"
                }
            };
            it('area should have changed', () => {
                return withAuth(chai.request(app).put('/api/areas/1'), token, eventId)
                    .send(requestBody)
                    .then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.body.area.name).to.equal("changedArea");
                    return db.Area.find({ where: { name: "changedArea" } });
                })
                    .then(area => {
                    expect(area).not.to.be.null;
                    expect(area.name).to.eq("changedArea");
                });
            });
        });
    });
});
