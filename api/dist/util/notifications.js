"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = createNotification;
const models_1 = __importDefault(require("../models"));
const logger = require('./logger');
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
async function createNotification(payload, transaction) {
    try {
        // Notifications are scoped to events; skip creation without an eventId.
        if (!payload.eventId)
            return null;
        const cutoff = new Date(Date.now() - TWO_HOURS_MS);
        // Keep the table small by deleting stale notifications per event.
        await models_1.default.Notification.destroy({
            where: {
                eventId: payload.eventId,
                createdAt: { [models_1.default.Sequelize.Op.lt]: cutoff }
            },
            transaction
        });
        return models_1.default.Notification.create({
            eventId: payload.eventId,
            entityType: payload.entityType,
            entityId: payload.entityId || null,
            action: payload.action,
            message: payload.message,
            meta: payload.meta || null
        }, transaction ? { transaction } : undefined);
    }
    catch (error) {
        logger.error({ error }, 'failed to create notification');
        return null;
    }
}
module.exports = { createNotification };
