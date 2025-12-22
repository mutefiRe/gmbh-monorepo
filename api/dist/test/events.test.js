'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require('chai');
const expect = chai.expect;
const app = require('../server');
const db = require('../models/index');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { clean, getEventId, withAuth } = require('./helper');
chai.use(chaiHttp);
const token = jwt.sign({
    id: 1,
    username: "test1",
    firstname: "test1",
    lastname: "test1",
    role: "admin"
}, config.secret, { expiresIn: '24h' });
describe('/events route', () => {
    let activeEventId;
    before(async () => {
        await clean();
        activeEventId = getEventId();
    });
    it('should list events with activeEventId', () => {
        return withAuth(chai.request(app).get('/api/events'), token)
            .then(res => {
            expect(res.status).to.equal(200);
            expect(res.body.activeEventId).to.equal(activeEventId);
            expect(res.body.events).to.be.an('array');
            expect(res.body.events.length).to.be.greaterThan(0);
        });
    });
    it('should create a new event', () => {
        return withAuth(chai.request(app).post('/api/events'), token)
            .send({ event: { name: 'Neues Event' } })
            .then(res => {
            expect(res.status).to.equal(200);
            expect(res.body.event.name).to.equal('Neues Event');
            expect(res.body.event.id).to.be.a('string');
        });
    });
    it('should update an event', async () => {
        const event = await db.Event.create({ name: 'Update Event' });
        const res = await withAuth(chai.request(app).put(`/api/events/${event.id}`), token)
            .send({ event: { name: 'Aktualisiert' } });
        expect(res.status).to.equal(200);
        expect(res.body.event.name).to.equal('Aktualisiert');
    });
    it('should block writes to inactive events', async () => {
        const inactiveEvent = await db.Event.create({ name: 'Inaktiv' });
        await db.Category.create({ id: 1, name: 'Testcat', enabled: true, eventId: inactiveEvent.id });
        await db.Unit.create({ id: 1, name: 'Testunit', eventId: inactiveEvent.id });
        try {
            await withAuth(chai.request(app).post('/api/items'), token, inactiveEvent.id)
                .send({
                item: {
                    name: 'Item X',
                    amount: 1,
                    price: 2.5,
                    categoryId: "1",
                    unitId: "1"
                }
            });
            throw new Error('Expected write to be blocked');
        }
        catch (res) {
            expect(res.status).to.equal(403);
            expect(res.response.text).to.contain('event is inactive');
        }
    });
});
