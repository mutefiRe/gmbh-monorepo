'use strict';
const router = require('express').Router();
const db = require('../../models');
const requireRole = require('../permissions');
async function loadSetting(transaction) {
    return db.Setting.findOne({ transaction });
}
router.get('/', requireRole('admin'), async function (req, res) {
    const [setting, events] = await Promise.all([
        loadSetting(),
        db.Event.findAll({ order: [['createdAt', 'DESC']] })
    ]);
    res.send({
        events,
        activeEventId: setting?.activeEventId || null
    });
});
router.post('/', requireRole('admin'), async function (req, res) {
    const payload = req.body.event || {};
    try {
        const event = await db.sequelize.transaction(async (transaction) => {
            const created = await db.Event.create(payload, { transaction });
            const setting = await loadSetting(transaction);
            if (setting) {
                await setting.update({ activeEventId: created.id }, { transaction });
            }
            return created;
        });
        res.send({ event });
    }
    catch (err) {
        res.status(400).send({
            errors: { msg: err.errors?.[0]?.message || err.message }
        });
    }
});
router.put('/:id', requireRole('admin'), async function (req, res) {
    const payload = req.body.event || {};
    try {
        const event = await db.Event.findOne({ where: { id: req.params.id } });
        if (!event) {
            res.status(404).send({ errors: { msg: 'event not found' } });
            return;
        }
        const updated = await event.update(payload);
        res.send({ event: updated });
    }
    catch (err) {
        res.status(400).send({
            errors: { msg: err.errors?.[0]?.message || err.message }
        });
    }
});
module.exports = router;
