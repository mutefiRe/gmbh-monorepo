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
describe('/item route', () => {
    let eventId;
    before(async () => {
        await clean();
        eventId = getEventId();
    });
    describe('items exists', () => {
        before(() => {
            return db.Category.create({
                id: 1,
                name: "category1",
                enabled: true,
                description: "newCategory",
                icon: null,
                showAmount: true,
                printer: null,
                eventId
            })
                .then(() => db.Unit.create({ id: 1, name: "unit1", eventId }))
                .then(() => db.Item.bulkCreate([{
                    id: "1",
                    name: "item1",
                    amount: 0.5,
                    price: 3.5,
                    group: null,
                    categoryId: "1",
                    unitId: "1",
                    eventId
                }, {
                    id: "2",
                    name: "item2",
                    amount: 0.5,
                    price: 3.5,
                    group: null,
                    categoryId: "1",
                    unitId: "1",
                    eventId
                }]));
        });
        describe('GET items', () => {
            const expectedResponse = {
                "items": [{
                        id: "1",
                        name: "item1",
                        amount: 0.5,
                        price: 3.5,
                        group: null,
                        categoryId: "1",
                        unitId: "1",
                        enabled: true,
                        eventId
                    }, {
                        id: "2",
                        name: "item2",
                        amount: 0.5,
                        price: 3.5,
                        group: null,
                        categoryId: "1",
                        unitId: "1",
                        enabled: true,
                        eventId
                    }]
            };
            it('should get one item', () => {
                return withAuth(chai.request(app).get('/api/items/1'), token, eventId)
                    .then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.body.item.name).to.equal("item1");
                });
            });
            it('should get all items', () => {
                return withAuth(chai.request(app).get('/api/items/'), token, eventId)
                    .then(res => {
                    expect(removeTimestamps(res.body)).to.deep.equal(expectedResponse);
                });
            });
        });
        describe('POST item', () => {
            const requestBody = {
                item: {
                    name: "newItem",
                    amount: 0.5,
                    price: 3.5,
                    group: null,
                    categoryId: "1",
                    unitId: "1"
                }
            };
            it('item should exist', () => {
                return withAuth(chai.request(app).post('/api/items'), token, eventId)
                    .send(requestBody)
                    .then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.body.item.name).to.equal("newItem");
                    return db.Item.find({ where: { name: "newItem" } });
                }).then(item => {
                    expect(item).not.to.be.null;
                    expect(item.name).to.eq("newItem");
                });
            });
        });
        describe('PUT item', () => {
            const requestBody = {
                item: {
                    name: "changedItem",
                    amount: 0.5,
                    price: 3.5,
                    group: null,
                    categoryId: "1",
                    unitId: "1",
                    enabled: false
                }
            };
            const expectedResponse = {
                item: {
                    id: "1",
                    name: "changedItem",
                    amount: 0.5,
                    price: 3.5,
                    group: null,
                    categoryId: "1",
                    unitId: "1",
                    enabled: false,
                    eventId
                }
            };
            it('item should have changed', () => {
                return withAuth(chai.request(app).put('/api/items/1'), token, eventId)
                    .send(requestBody)
                    .then(res => {
                    expect(res.status).to.equal(200);
                    expect(removeTimestamps(res.body)).to.deep.equal(expectedResponse);
                    return db.Item.find({ where: { name: "changedItem" } });
                }).then(item => {
                    expect(item).not.to.be.null;
                    expect(item.name).to.eq("changedItem");
                });
            });
        });
    });
});
