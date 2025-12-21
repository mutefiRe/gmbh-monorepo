"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = __importDefault(require("../../models"));
const router = (0, express_1.Router)();
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
router.get('/', async function (req, res) {
    try {
        const eventId = req.eventId;
        const skip = parseInt(String(req.query.skip || '0'), 10) || 0;
        const limitRaw = req.query.limit ? parseInt(String(req.query.limit), 10) : null;
        const limit = limitRaw !== null && !Number.isNaN(limitRaw) ? limitRaw : 5;
        const cutoff = new Date(Date.now() - TWO_HOURS_MS);
        // Only return recent notifications for the current event.
        const where = { eventId, createdAt: { [models_1.default.Sequelize.Op.gte]: cutoff } };
        const total = await models_1.default.Notification.count({ where });
        const notifications = await models_1.default.Notification.findAll({
            where,
            order: [['createdAt', 'DESC']],
            offset: skip,
            limit
        });
        res.send({
            notifications: JSON.parse(JSON.stringify(notifications)),
            count: notifications.length,
            total
        });
    }
    catch (error) {
        res.status(400).send({
            errors: {
                msg: error?.errors?.[0]?.message || error?.message
            }
        });
    }
});
module.exports = router;
