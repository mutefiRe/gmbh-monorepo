'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const router = require('express').Router();
const db = require('../../models');
router.get('/:id', function (req, res) {
    db.Unit.findOne({ where: { id: req.params.id, eventId: req.eventId } }).then(unit => {
        res.send({ unit });
    }).catch(error => {
        res.status(400).send({
            'errors': {
                'msg': error && error.errors && error.errors[0].message || error.message
            }
        });
    });
});
router.get('/', function (req, res) {
    db.Unit.findAll({ where: { eventId: req.eventId } }).then(units => {
        res.send({ units });
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
    db.Unit.create({ ...req.body.unit, eventId: req.eventId }).then(unit => {
        res.send({ unit });
        io.sockets.emit("update", { unit, eventId: req.eventId });
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
    db.Unit.findOne({ where: { id: req.params.id, eventId: req.eventId } }).then(unit => {
        if (unit === null)
            throw new Error('unit not found');
        return unit.update({ ...req.body.unit, eventId: req.eventId });
    }).then(unit => {
        res.send({ unit });
        io.sockets.emit("update", { unit, eventId: req.eventId });
    }).catch(error => {
        res.status(400).send({
            'errors': {
                'msg': error && error.errors && error.errors[0].message || error.message
            }
        });
    });
});
router.delete('/:id', async function (req, res) {
    const io = req.app.get('io');
    try {
        const unit = await db.Unit.findOne({ where: { id: req.params.id, eventId: req.eventId } });
        if (unit === null) {
            throw new Error('unit not found');
        }
        const unitId = unit.id;
        await unit.destroy();
        res.send({});
        io.sockets.emit("delete", { type: 'unit', id: unitId, eventId: req.eventId });
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
