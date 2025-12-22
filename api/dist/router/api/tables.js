'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
const db = require('../../models');
const { createNotification } = require('../../util/notifications');
router.get('/:id', function (req, res) {
    db.Table.findOne({ where: { id: req.params.id, eventId: req.eventId } }).then(table => {
        res.send({ table });
    }).catch(error => {
        res.status(400).send({
            'errors': {
                'msg': error && error.errors && error.errors[0].message || error.message
            }
        });
    });
});
router.get('/', function (req, res) {
    db.Table.findAll({ where: { eventId: req.eventId } }).then(tables => {
        res.send({ tables });
    }).catch(error => {
        res.status(400).send({
            'errors': {
                'msg': error && error.errors && error.errors[0].message || error.message
            }
        });
    });
});
router.post('/', function (req, res) {
    const io = req.app.get('io');
    db.Table.create({ ...req.body.table, eventId: req.eventId }).then(table => {
        io.sockets.emit("update", { table, eventId: req.eventId });
        res.send({ table });
        createNotification({
            eventId: req.eventId,
            entityType: 'table',
            entityId: table.id,
            action: 'created',
            message: `Neuer Tisch: ${table.name}`
        }).then((notification) => {
            if (notification) {
                io.sockets.emit("notification", { notification, eventId: req.eventId });
            }
        });
    }).catch(error => {
        res.status(400).send({
            'errors': {
                'msg': error && error.errors && error.errors[0].message || error.message
            }
        });
    });
});
router.put('/:id', function (req, res) {
    const io = req.app.get('io');
    let previousEnabled;
    db.Table.findOne({ where: { id: req.params.id, eventId: req.eventId } }).then(table => {
        if (table === null)
            throw new Error('table not found');
        previousEnabled = table.enabled;
        return table.update({ ...req.body.table, eventId: req.eventId });
    }).then(table => {
        res.send({ table });
        io.sockets.emit("update", { table, eventId: req.eventId });
        if (previousEnabled !== false && table.enabled === false) {
            createNotification({
                eventId: req.eventId,
                entityType: 'table',
                entityId: table.id,
                action: 'deactivated',
                message: `Tisch deaktiviert: ${table.name}`
            }).then((notification) => {
                if (notification) {
                    io.sockets.emit("notification", { notification, eventId: req.eventId });
                }
            });
        }
    }).catch(error => {
        res.status(400).send({
            'errors': {
                'msg': error && error.errors && error.errors[0].message || error.message
            }
        });
    });
});
router.delete('/:id', function (req, res) {
    const io = req.app.get('io');
    db.Table.findOne({ where: { id: req.params.id, eventId: req.eventId } }).then(table => {
        if (table === null)
            throw new Error('table not found');
        return table.destroy().then(() => table);
    }).then((table) => {
        res.send({});
        io.sockets.emit("delete", { 'type': 'table', 'id': table.id, eventId: req.eventId });
    }).catch(error => {
        res.status(400).send({
            'errors': {
                'msg': error && error.errors && error.errors[0].message || error.message
            }
        });
    });
});
module.exports = router;
