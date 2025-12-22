import { Router, type Request, type Response } from 'express';
import db from '../../models';

interface AuthenticatedRequest extends Request {
  eventId?: string;
}

const router = Router();
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

router.get('/', async function (req: Request, res: Response) {
  try {
    const eventId = (req as AuthenticatedRequest).eventId;
    const skip = parseInt(String(req.query.skip || '0'), 10) || 0;
    const limitRaw = req.query.limit ? parseInt(String(req.query.limit), 10) : null;
    const limit = limitRaw !== null && !Number.isNaN(limitRaw) ? limitRaw : 5;
    const cutoff = new Date(Date.now() - TWO_HOURS_MS);

    // Only return recent notifications for the current event.
    const where = { eventId, createdAt: { [db.Sequelize.Op.gte]: cutoff } };
    const total = await db.Notification.count({ where });
    const notifications = await db.Notification.findAll({
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
  } catch (error: any) {
    res.status(400).send({
      errors: {
        msg: error?.errors?.[0]?.message || error?.message
      }
    });
  }
});

module.exports = router;
