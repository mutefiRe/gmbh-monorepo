const db = require('../models');
async function eventScope(req, res, next) {
    try {
        const headerEventId = req.header('x-event-id');
        const setting = await db.Setting.findOne();
        if (headerEventId) {
            const event = await db.Event.findOne({ where: { id: headerEventId } });
            if (!event) {
                res.status(404).send({ errors: { msg: 'event not found' } });
                return;
            }
            req.eventId = event.id;
            req.activeEventId = setting?.activeEventId || null;
            req.eventSetting = setting || null;
            next();
            return;
        }
        if (!setting || !setting.activeEventId) {
            res.status(400).send({ errors: { msg: 'no active event configured' } });
            return;
        }
        const activeEvent = await db.Event.findOne({ where: { id: setting.activeEventId } });
        if (!activeEvent) {
            res.status(400).send({ errors: { msg: 'active event not found' } });
            return;
        }
        req.eventId = activeEvent.id;
        req.activeEventId = activeEvent.id;
        req.eventSetting = setting;
        next();
    }
    catch (error) {
        res.status(500).send({
            errors: {
                msg: error?.message || 'failed to resolve event'
            }
        });
    }
}
module.exports = eventScope;
