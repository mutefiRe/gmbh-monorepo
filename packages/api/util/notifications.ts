import db from '../models';
const logger = require('./logger');

type NotificationPayload = {
  eventId?: string;
  entityType: string;
  entityId?: string | null;
  action: string;
  message: string;
  meta?: Record<string, unknown> | null;
};

const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

export async function createNotification(
  payload: NotificationPayload,
  transaction?: any
) {
  try {
    // Notifications are scoped to events; skip creation without an eventId.
    if (!payload.eventId) return null;
    const cutoff = new Date(Date.now() - TWO_HOURS_MS);
    // Keep the table small by deleting stale notifications per event.
    await db.Notification.destroy({
      where: {
        eventId: payload.eventId,
        createdAt: { [db.Sequelize.Op.lt]: cutoff }
      },
      transaction
    });

    return db.Notification.create(
      {
        eventId: payload.eventId,
        entityType: payload.entityType,
        entityId: payload.entityId || null,
        action: payload.action,
        message: payload.message,
        meta: payload.meta || null
      },
      transaction ? { transaction } : undefined
    );
  } catch (error: any) {
    logger.error({ error }, 'failed to create notification');
    return null;
  }
}

module.exports = { createNotification };
