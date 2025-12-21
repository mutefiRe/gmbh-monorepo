'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const router = require('express').Router();
const db = require('../../models');
const { createNotification } = require('../../util/notifications');
router.get('/:id', function (req, res) {
    db.Item.findOne({ where: { id: req.params.id, eventId: req.eventId } }).then(item => {
        if (item === null)
            throw new Error("item not found");
        else {
            res.send({ item });
        }
    }).catch(error => {
        res.status(400).send({
            'errors': {
                'msg': error && error.errors && error.errors[0].message || error.message
            }
        });
    });
});
router.get('/', async function (req, res) {
    try {
        const items = await db.Item.findAll({ where: { eventId: req.eventId } });
        res.send({ items });
    }
    catch (error) {
        res.status(400).send({
            'errors': {
                'msg': error && error.errors && error.errors[0].message || error.message
            }
        });
    }
});
router.post('/', async function (req, res) {
    const io = req.app.get('io');
    try {
        const item = await db.Item.create({ ...req.body.item, eventId: req.eventId });
        res.send({ item });
        io.sockets.emit("update", { item, eventId: req.eventId });
        createNotification({
            eventId: req.eventId,
            entityType: 'item',
            entityId: item.id,
            action: 'created',
            message: `Neuer Artikel: ${item.name}`
        }).then((notification) => {
            if (notification) {
                io.sockets.emit("notification", { notification, eventId: req.eventId });
            }
        });
    }
    catch (error) {
        res.status(400).send({
            'errors': {
                'msg': error && error.errors && error.errors[0].message || error.message
            }
        });
    }
});
router.put('/:id', async function (req, res) {
    const io = req.app.get('io');
    try {
        const item = await db.Item.findOne({ where: { id: req.params.id, eventId: req.eventId } });
        if (item === null)
            throw new Error("item not found");
        const previousPrice = Number(item.price);
        const previousEnabled = item.enabled;
        const updatedItem = await item.update({ ...req.body.item, eventId: req.eventId });
        res.send({ item });
        io.sockets.emit("update", { item, eventId: req.eventId });
        const nextPrice = Number(updatedItem.price);
        if (!Number.isNaN(previousPrice) && !Number.isNaN(nextPrice) && previousPrice !== nextPrice) {
            createNotification({
                eventId: req.eventId,
                entityType: 'item',
                entityId: updatedItem.id,
                action: 'priceChanged',
                message: `Preis geändert: ${updatedItem.name}`,
                meta: { from: previousPrice, to: nextPrice }
            }).then((notification) => {
                if (notification) {
                    io.sockets.emit("notification", { notification, eventId: req.eventId });
                }
            });
        }
        if (previousEnabled !== false && updatedItem.enabled === false) {
            createNotification({
                eventId: req.eventId,
                entityType: 'item',
                entityId: updatedItem.id,
                action: 'deactivated',
                message: `Artikel deaktiviert: ${updatedItem.name}`
            }).then((notification) => {
                if (notification) {
                    io.sockets.emit("notification", { notification, eventId: req.eventId });
                }
            });
        }
    }
    catch (error) {
        res.status(400).send({
            'errors': {
                'msg': error && error.errors && error.errors[0].message || error.message
            }
        });
    }
});
router.delete('/:id', async function (req, res) {
    const io = req.app.get('io');
    try {
        await db.Item.destroy({ where: { id: req.params.id, eventId: req.eventId } });
        res.send({});
        io.sockets.emit("delete", { 'type': 'item', 'id': req.params.id, eventId: req.eventId });
    }
    catch (error) {
        res.status(400).send({
            'errors': {
                'msg': error && error.errors && error.errors[0].message || error.message
            }
        });
    }
});
module.exports = router;
