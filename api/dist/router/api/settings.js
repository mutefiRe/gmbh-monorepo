'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const router = require('express').Router();
const db = require('../../models');
const requireRole = require('../permissions');
async function loadSetting() {
    return db.Setting.findOne({
        include: [
            { model: db.Event, as: 'activeEvent' }
        ]
    });
}
async function ensureEventExists(activeEventId) {
    if (!activeEventId) {
        return false;
    }
    const event = await db.Event.findOne({ where: { id: activeEventId } });
    return Boolean(event);
}
router.get('/', async function (req, res) {
    const setting = await loadSetting();
    if (!setting) {
        res.status(404).send({
            errors: { msg: "couldn't find any settings" }
        });
        return;
    }
    res.send({ setting });
});
router.post('/', requireRole('admin'), async function (req, res) {
    const existing = await loadSetting();
    if (existing) {
        res.status(400).send({
            errors: { msg: 'settings already exist' }
        });
        return;
    }
    const payload = req.body.setting || {};
    if (!(await ensureEventExists(payload.activeEventId))) {
        res.status(404).send({
            errors: { msg: 'active event not found' }
        });
        return;
    }
    try {
        const setting = await db.Setting.create(payload);
        res.send({ setting });
    }
    catch (err) {
        res.status(400).send({
            errors: { msg: err.errors?.[0]?.message || err.message }
        });
    }
});
router.put('/', requireRole('admin'), async function (req, res) {
    const setting = await db.Setting.findOne();
    if (!setting) {
        res.status(404).send({
            errors: { msg: "couldn't find any settings" }
        });
        return;
    }
    const payload = req.body.setting || {};
    if (payload.activeEventId && !(await ensureEventExists(payload.activeEventId))) {
        res.status(404).send({
            errors: { msg: 'active event not found' }
        });
        return;
    }
    try {
        const updated = await setting.update(payload);
        res.send({ setting: updated });
    }
    catch (err) {
        res.status(400).send({
            errors: { msg: err.errors?.[0]?.message || err.message }
        });
    }
});
module.exports = router;
