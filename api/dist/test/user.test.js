'use strict';
const chai = require('chai');
const expect = chai.expect;
const app = require('../server');
const db = require('../models/index');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { clean, removeTimestamps } = require('./helper');
chai.use(chaiHttp);
const token = jwt.sign({
    id: 1,
    username: "test1",
    firstname: "test1",
    lastname: "test1",
    role: "admin"
}, config.secret, { expiresIn: '24h' });
describe('/user route', () => {
    before(clean);
    describe('users exists', () => {
        const printer1 = "277056cb-b639-4365-9532-563ca57d714d";
        const printer2 = "a0470f0b-6e43-4773-895d-72bc08c19439";
        before(() => {
            return db.Printer.bulkCreate([{
                    id: printer1,
                    systemName: "test"
                }, {
                    id: printer2,
                    systemName: "test2"
                }])
                .then(db.User.bulkCreate([
                { id: 1, username: "test1", firstname: "test1", lastname: "test1", password: "test1", role: "admin", printerId: printer1 },
                { id: 2, username: "test2", firstname: "test2", lastname: "test2", password: "test2", role: "waiter" }
            ]));
        });
        describe('GET users', () => {
            const expectedResponse = {
                "users": [{
                        "id": "1",
                        "username": "test1",
                        "firstname": "test1",
                        "lastname": "test1",
                        "role": "admin",
                        "printerId": printer1,
                        "areas": []
                    }, {
                        "id": "2",
                        "username": "test2",
                        "firstname": "test2",
                        "lastname": "test2",
                        "role": "waiter",
                        "printerId": null,
                        "areas": []
                    }]
            };
            it('should get one user', () => {
                return chai.request(app)
                    .get('/api/users/1')
                    .send({ token })
                    .then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.body.user.username).to.equal("test1");
                });
            });
            it('should get all users', () => {
                return chai.request(app)
                    .get('/api/users/')
                    .send({ token })
                    .then(res => {
                    expect(res.status).to.equal(200);
                    expect(removeTimestamps(res.body)).to.deep.equal(expectedResponse);
                });
            });
        });
        describe('POST user', () => {
            const requestBody = {
                user: {
                    username: "username",
                    firstname: "firstname",
                    lastname: "lastname",
                    password: "password",
                    role: "admin",
                    printerId: null
                }
            };
            it('user should exist', () => {
                return chai.request(app)
                    .post('/api/users')
                    .set("x-access-token", token)
                    .send(requestBody)
                    .then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.body.user.username).to.equal("username");
                    return db.User.find({ where: { username: "username" } });
                }).then(user => {
                    expect(user).not.to.be.null;
                    expect(user.username).to.eq("username");
                    expect(user.firstname).to.eq("firstname");
                    expect(user.lastname).to.eq("lastname");
                    expect(user.role).to.eq("admin");
                    expect(user.printerId).to.eq(null);
                });
            });
        });
        describe('PUT user', () => {
            const requestBody = {
                user: {
                    username: "username2",
                    firstname: "firstname",
                    lastname: "lastname",
                    password: "password",
                    role: "admin",
                    printerId: printer2
                }
            };
            it('user should have changed', () => {
                return chai.request(app)
                    .put('/api/users/1')
                    .set("x-access-token", token)
                    .send(requestBody)
                    .then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.body.user.username).to.equal("username2");
                    return db.User.find({ where: { username: "username2" } });
                }).then(user => {
                    expect(user).not.to.be.null;
                    expect(user.username).to.eq("username2");
                    expect(user.firstname).to.eq("firstname");
                    expect(user.lastname).to.eq("lastname");
                    expect(user.role).to.eq("admin");
                    expect(user.printerId).to.eq(printer2);
                });
            });
        });
    });
});
