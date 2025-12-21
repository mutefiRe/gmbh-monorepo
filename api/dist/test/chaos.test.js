"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiHttpPlugin = chaiHttp.default || chaiHttp;
chai.use(chaiHttpPlugin);
const { expect } = chai;
const API_BASE = process.env.CHAOS_API_BASE || 'http://localhost:8080';
const asAdmin = (token, eventId) => {
    const req = chai.request(API_BASE).get('/');
    req.set('x-access-token', token);
    if (eventId) {
        req.set('x-event-id', eventId);
    }
    return req;
};
const requestWithAuth = (token, eventId) => ({
    get: (path) => {
        const req = chai.request(API_BASE).get(path).set('x-access-token', token);
        if (eventId)
            req.set('x-event-id', eventId);
        return req;
    },
    post: (path) => {
        const req = chai.request(API_BASE).post(path).set('x-access-token', token);
        if (eventId)
            req.set('x-event-id', eventId);
        return req;
    },
    put: (path) => {
        const req = chai.request(API_BASE).put(path).set('x-access-token', token);
        if (eventId)
            req.set('x-event-id', eventId);
        return req;
    },
    delete: (path) => {
        const req = chai.request(API_BASE).delete(path).set('x-access-token', token);
        if (eventId)
            req.set('x-event-id', eventId);
        return req;
    }
});
describe('chaos: admin API manipulation and orders still work', function () {
    this.timeout(60000);
    let token = '';
    let eventId = null;
    let unitId = '';
    let categoryId = '';
    let areaId = '';
    let tableId = '';
    let itemId = '';
    before(async () => {
        const loginRes = await chai.request(API_BASE)
            .post('/authenticate')
            .send({ username: 'admin', password: 'bierh0len!' });
        expect(loginRes).to.have.status(200);
        token = loginRes.body.token;
        const eventsRes = await asAdmin(token).get('/api/events');
        expect(eventsRes).to.have.status(200);
        eventId = eventsRes.body.activeEventId || eventsRes.body.events?.[0]?.id || null;
    });
    it('creates baseline data with odd values and still succeeds', async () => {
        const api = requestWithAuth(token, eventId);
        const unitRes = await api.post('/api/units').send({ unit: { name: 'Liter' } });
        expect(unitRes).to.have.status(200);
        unitId = unitRes.body.unit.id;
        const areaRes = await api.post('/api/areas').send({ area: { name: 'Main', short: 'M', enabled: true } });
        expect(areaRes).to.have.status(200);
        areaId = areaRes.body.area.id;
        const tableRes = await api.post('/api/tables').send({
            table: { name: '99', seats: 2, enabled: true, areaId }
        });
        expect(tableRes).to.have.status(200);
        tableId = tableRes.body.table.id;
        const categoryRes = await api.post('/api/categories').send({
            category: {
                name: 'Verrückt & Bunt',
                enabled: true,
                icon: 'glass',
                color: '#22c55e',
                showAmount: true
            }
        });
        expect(categoryRes).to.have.status(200);
        categoryId = categoryRes.body.category.id;
        const itemRes = await api.post('/api/items').send({
            item: {
                name: 'Superlanges Getränk mit Sonderzeichen!!!',
                amount: 0.33,
                price: 9.99,
                sort: 9999,
                enabled: true,
                categoryId,
                unitId
            }
        });
        expect(itemRes).to.have.status(200);
        itemId = itemRes.body.item.id;
    });
    it('rejects invalid requests but allows new orders afterwards', async () => {
        const api = requestWithAuth(token, eventId);
        const badItemRes = await api.post('/api/items').send({
            item: { name: 'Bad Item', price: 'not-a-number', amount: 1 }
        });
        expect(badItemRes).to.have.status(400);
        const badOrderRes = await api.post('/api/orders').send({ order: { tableId } });
        expect(badOrderRes).to.have.status(400);
        const orderRes = await api.post('/api/orders').send({
            order: {
                tableId,
                orderitems: [
                    { itemId, count: 2, countPaid: 0, countFree: 0, price: 9.99, extras: 'extra schaum' }
                ]
            }
        });
        expect(orderRes).to.have.status(200);
    });
    it('handles payment updates and a second order', async () => {
        const api = requestWithAuth(token, eventId);
        const orderRes = await api.post('/api/orders').send({
            order: {
                tableId,
                orderitems: [
                    { itemId, count: 3, countPaid: 0, countFree: 0, price: 9.99 }
                ]
            }
        });
        expect(orderRes).to.have.status(200);
        const order = orderRes.body.order;
        const updatedItems = (order.orderitems || []).map((oi) => ({
            id: oi.id,
            count: oi.count,
            countPaid: Math.max(1, Math.floor(oi.count / 2)),
            countFree: oi.countFree || 0,
            price: oi.price
        }));
        const updateRes = await api.put(`/api/orders/${order.id}`).send({
            order: { id: order.id, orderitems: updatedItems }
        });
        expect(updateRes).to.have.status(200);
        const orderRes2 = await api.post('/api/orders').send({
            order: {
                tableId,
                orderitems: [
                    { itemId, count: 1, countPaid: 1, countFree: 0, price: 9.99 }
                ]
            }
        });
        expect(orderRes2).to.have.status(200);
    });
});
