'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const router = require('express').Router();
const db = require('../../models');
const requireRole = require('../permissions');
const { createNotification } = require('../../util/notifications');
// waiter or admin
router.get('/:id', requireRole('waiter', 'admin'), function (req, res) {
    db.Area.findOne({ where: { id: req.params.id, eventId: req.eventId } }).then(area => {
        res.send({ area });
    });
});
// waiter or admin
router.get('/', requireRole('waiter', 'admin'), function (req, res) {
    db.Area.findAll({
        where: { eventId: req.eventId },
        include: [{ model: db.Table, where: { eventId: req.eventId }, required: false }, { model: db.User }]
    }).then(data => {
        const areas = JSON.parse(JSON.stringify(data));
        for (let i = 0; i < areas.length; i++) {
            areas[i].tables = areas[i].tables.map(table => table.id);
            areas[i].users = areas[i].users.map(user => user.id);
        }
        res.send({ areas });
    }).catch(error => {
        res.status(400).send({
            'errors': {
                'msg': error && error.errors && error.errors[0].message || error.message
            }
        });
    });
});
// admin only
router.post('/', requireRole('admin'), function (req, res) {
    const io = req.app.get('io');
    const payload = { ...req.body.area, eventId: req.eventId };
    db.Area.create(payload).then(area => {
        res.send({ area });
        io.sockets.emit("update", { area, eventId: req.eventId });
        createNotification({
            eventId: req.eventId,
            entityType: 'area',
            entityId: area.id,
            action: 'created',
            message: `Neuer Bereich: ${area.name}`
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
// admin only
router.put('/:id', requireRole('admin'), function (req, res) {
    const io = req.app.get('io');
    db.Area.findOne({ where: { id: req.params.id, eventId: req.eventId } }).then(area => {
        if (area === null)
            throw new Error("area not found");
        return area.update({ ...req.body.area, eventId: req.eventId });
    }).then(area => {
        res.send({ area });
        io.sockets.emit("update", { area, eventId: req.eventId });
    }).catch(error => {
        res.status(400).send({
            'errors': {
                'msg': error && error.errors && error.errors[0].message || error.message
            }
        });
    });
});
// admin only
router.delete('/:id', requireRole('admin'), async function (req, res) {
    const io = req.app.get('io');
    try {
        const area = await db.Area.findOne({ where: { id: req.params.id, eventId: req.eventId } });
        if (area === null) {
            throw new Error('area not found');
        }
        const areaId = area.id;
        await area.destroy();
        res.send({});
        io.sockets.emit("delete", { type: 'area', id: areaId, eventId: req.eventId });
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
