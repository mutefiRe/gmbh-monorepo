'use strict';
const chai = require('chai');
const app = require('../server');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { clean } = require('./helper');
const expect = chai.expect;
chai.use(chaiHttp);
describe('/api route -> check restriction access', () => {
    before(clean);
    const token = jwt.sign({
        username: "test",
        firstname: "test",
        lastname: "test",
        role: "admin"
    }, config.secret, { expiresIn: '24h' });
    it('should response status 200 to api call, when send with token', () => {
        return chai.request(app)
            .get('/api/orders')
            .send({ token })
            .then(res => {
            expect(res.status).to.equal(200);
        });
    });
    it('should response status 400 to api call, when send with wrong token', () => {
        return chai.request(app)
            .get('/api/orders')
            .send({ token: token + 1 })
            .catch(res => {
            expect(res.status).equal(400);
            expect(res.response).to.be.json;
            expect(res.response.status).to.equal(401);
            expect(res.response.text).to.contain("auth.tokenError");
        });
    });
    it('should response status 400 to api call, when send without token', () => {
        return chai.request(app)
            .get('/api/orders')
            .send({})
            .catch(res => {
            expect(res.status).to.equal(400);
            expect(res.response).to.be.json;
            expect(res.response.status).to.equal(401);
            expect(res.response.text).to.contain('auth.tokenError');
        });
    });
    it('should response status 400 to api call, when send with expired token', () => {
        const expiredToken = jwt.sign({
            username: "test",
            firstname: "test",
            lastname: "test",
            role: "admin"
        }, config.secret, { expiresIn: '0' });
        return chai.request(app)
            .get('/api/orders')
            .send({ token: expiredToken })
            .catch(res => {
            expect(res.status).to.equal(400);
            expect(res.response).to.be.json;
            expect(res.response.status).to.equal(401);
            expect(res.response.text).to.contain("auth.tokenError");
        });
    });
    describe('-> check role access', () => {
        const tokenWaiter = jwt.sign({
            username: "test",
            firstname: "test",
            lastname: "test",
            role: "waiter"
        }, config.secret, { expiresIn: '24h' });
        it('should response with 403 for DELETE method (waiter: /orders/:id)', () => {
            return chai.request(app)
                .delete('/api/orders/1')
                .send({ token: tokenWaiter })
                .catch(res => {
                expect(res.status).to.equal(403);
            });
        });
        it('should be able to access PUT method (waiter: /orders/:id)', () => {
            return chai.request(app)
                .put('/api/orders/1')
                .send({ token: tokenWaiter })
                .then(res => {
                expect(res.status).to.equal(200);
            })
                .catch(res => {
                expect(res.status).to.not.equal(403);
            });
        });
        it('should be able to access GET method (waiter: /orders/:id)', () => {
            return chai.request(app)
                .get('/api/orders/1')
                .send({ token: tokenWaiter })
                .then(res => {
                expect(res.status).to.equal(200);
            });
        });
    });
});
