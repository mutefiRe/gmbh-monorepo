import { Router, type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import db from '../models';
const areas = require('./api/areas');
const users = require('./api/users');
const organizations = require('./api/organizations');
const items = require('./api/items');
const categories = require('./api/categories');
const units = require('./api/units');
const tables = require('./api/tables');
const orders = require('./api/orders');
const orderitems = require('./api/orderitems');
const settings = require('./api/settings');
const printers = require('./api/printers');
const prints = require('./api/prints');
const stats = require('./api/stats');
const events = require('./api/events');
const notifications = require('./api/notifications');
const eventScope = require('../middleware/event-scope');
const eventReadOnly = require('../middleware/event-readonly');
const updateRouter = require('./api/update');
const requireRole = require('./permissions');
const config = require('../config/config');

const router = Router();

const ACTIVE_USER_WINDOW_MS = 5 * 60 * 1000;
const MAX_ACTIVE_USERS = 200;
const activeUsers = new Map<string, { id: string; username: string; role?: string; lastSeen: number }>();

function extractToken(req: Request) {
  const authHeader = (req.headers?.authorization as string | undefined) || '';
  const bearerToken = authHeader.toLowerCase().startsWith('bearer ')
    ? authHeader.slice(7).trim()
    : undefined;
  return bearerToken
    || (req.body as any)?.token
    || (req.query as any)?.token
    || (req.headers?.['x-access-token'] as string | undefined)
    || (req.cookies as any)?.['x-gmbh-token'];
}

function pruneActiveUsers(now: number) {
  const cutoff = now - ACTIVE_USER_WINDOW_MS;
  for (const [id, user] of activeUsers.entries()) {
    if (user.lastSeen < cutoff) {
      activeUsers.delete(id);
    }
  }
  if (activeUsers.size <= MAX_ACTIVE_USERS) return;
  const sorted = [...activeUsers.values()].sort((a, b) => a.lastSeen - b.lastSeen);
  const overflow = sorted.length - MAX_ACTIVE_USERS;
  for (let i = 0; i < overflow; i += 1) {
    activeUsers.delete(sorted[i].id);
  }
}

function updateActiveUsersFromToken(token: string | undefined, now: number) {
  if (!token) return;
  try {
    const decoded: any = jwt.verify(token, config.secret);
    if (decoded?.id) {
      activeUsers.set(decoded.id, {
        id: decoded.id,
        username: decoded.username || decoded.firstname || decoded.lastname || 'unbekannt',
        role: decoded.role,
        lastSeen: now
      });
    }
  } catch (err) {
    // ignore invalid tokens for status tracking
  }
  pruneActiveUsers(now);
}

router.use("/users", users);
router.use("/printers", printers);
router.use("/events", events);
router.use("/notifications", eventScope, notifications);
router.use("/areas", eventScope, eventReadOnly, areas);
router.use("/organizations", eventScope, eventReadOnly, organizations);
router.use("/items", eventScope, eventReadOnly, items);
router.use("/categories", eventScope, eventReadOnly, categories);
router.use("/units", eventScope, eventReadOnly, units);
router.use("/tables", eventScope, eventReadOnly, tables);
router.use("/orders", eventScope, eventReadOnly, orders);
router.use("/orderitems", eventScope, eventReadOnly, orderitems);
router.use("/settings", settings);
router.use("/prints", eventScope, eventReadOnly, prints);
router.use("/stats", eventScope, eventReadOnly, stats);
router.use("/update", requireRole('admin'), updateRouter);

router.get('/', function (req: Request, res: Response) {
  res.status(200).send({ "msg": "you have access to the api" });
});

router.get('/healthz', function (req: Request, res: Response) {
  res.setHeader('Cache-Control', 'no-store');
  updateActiveUsersFromToken(extractToken(req), Date.now());
  res.status(200).send({ status: 'ok' });
});

router.get('/status', async function (req: Request, res: Response) {
  res.setHeader('Cache-Control', 'no-store');
  const now = Date.now();
  const token = extractToken(req);
  updateActiveUsersFromToken(token, now);

  const response: Record<string, unknown> = {
    status: 'ok',
    api: { ok: true }
  };

  if (token) {
    try {
      const decoded: any = jwt.verify(token, config.secret);
      if (decoded?.role === 'admin') {
        const cutoff = now - ACTIVE_USER_WINDOW_MS;
        const users = [...activeUsers.values()]
          .filter((user) => user.lastSeen >= cutoff)
          .sort((a, b) => b.lastSeen - a.lastSeen);
        response.activeWindowMinutes = Math.round(ACTIVE_USER_WINDOW_MS / 60000);
        response.activeUsers = users;
      }
    } catch (err) {
      // ignore token errors for status response
    }
  }

  const printerUrl = (process.env.PRINTER_API_URL || 'http://localhost:8761').replace(/\/$/, '');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1500);
  try {
    const resPrinter = await fetch(`${printerUrl}/healthz`, { signal: controller.signal });
    response.printerApi = { ok: resPrinter.ok };
  } catch (err: any) {
    response.printerApi = { ok: false, error: err?.message || 'unreachable' };
  } finally {
    clearTimeout(timeout);
  }

  res.status(200).send(response);
});

router.get('/status/orders', eventScope, requireRole('admin'), async function (req: Request, res: Response) {
  const eventId = (req as any).eventId as string | undefined;
  const windowMinutes = Number(req.query.windowMinutes || 15);
  const bucketSeconds = Number(req.query.bucketSeconds || 60);
  const safeWindow = Number.isFinite(windowMinutes) ? Math.min(Math.max(windowMinutes, 1), 60) : 15;
  const safeBucket = Number.isFinite(bucketSeconds) ? Math.min(Math.max(bucketSeconds, 10), 300) : 60;
  const since = new Date(Date.now() - safeWindow * 60 * 1000);

  try {
    const orders = await db.Order.findAll({
      attributes: ['createdAt'],
      where: {
        eventId,
        createdAt: { [db.Sequelize.Op.gte]: since }
      },
      order: [['createdAt', 'ASC']]
    });

    const bucketMs = safeBucket * 1000;
    const buckets: Record<number, number> = {};
    for (const order of orders) {
      const ts = new Date(order.createdAt).getTime();
      const bucket = Math.floor(ts / bucketMs) * bucketMs;
      buckets[bucket] = (buckets[bucket] || 0) + 1;
    }

    const now = Date.now();
    const start = Math.floor(since.getTime() / bucketMs) * bucketMs;
    const points = [];
    for (let ts = start; ts <= now; ts += bucketMs) {
      points.push({ ts, count: buckets[ts] || 0 });
    }

    res.send({ points, windowMinutes: safeWindow, bucketSeconds: safeBucket });
  } catch (error: any) {
    res.status(400).send({
      errors: {
        msg: error?.errors?.[0]?.message || error?.message
      }
    });
  }
});

module.exports = router;
