import { Router, type Request, type Response } from 'express';
import db from '../../models';

const router = Router();

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function getTotalRevenue(eventId: string | undefined) {
  const dialect = db.sequelize.options.dialect;
  const revenueQuery: Record<string, string> = {
    mysql: 'SELECT SUM(orderitems.price * orderitems.countPaid) AS revenue FROM gmbh.orderitems INNER JOIN gmbh.orders ON orderitems.orderId = orders.id WHERE orderitems.countPaid <> 0 AND orders.eventId = :eventId',
    postgres: 'SELECT SUM(orderitems.price * "countPaid") AS revenue FROM orderitems INNER JOIN orders ON orderitems."orderId" = orders.id WHERE orderitems."countPaid" <> 0 AND orders."eventId" = :eventId'
  };

  const [revenueRow] = await db.sequelize.query(revenueQuery[dialect], {
    type: db.sequelize.QueryTypes.SELECT,
    replacements: { eventId }
  });
  return Number((revenueRow as { revenue?: number | string })?.revenue || 0);
}

async function getSalesByDay(eventId: string | undefined) {
  const since = new Date();
  since.setDate(since.getDate() - 6);
  since.setHours(0, 0, 0, 0);

  const ordersForSales = await db.Order.findAll({
    where: { createdAt: { [db.Sequelize.Op.gte]: since }, eventId },
    include: [{ model: db.Orderitem }],
    order: [['createdAt', 'DESC']]
  });

  const salesMap = new Map<string, number>();
  for (let i = 6; i >= 0; i -= 1) {
    const day = new Date();
    day.setDate(day.getDate() - i);
    const key = formatDateKey(day);
    salesMap.set(key, 0);
  }

  ordersForSales.forEach((order: any) => {
    const dateKey = formatDateKey(new Date(order.createdAt));
    const items = order.orderitems || [];
    const orderTotal = items.reduce((sum: number, oi: any) => sum + Number(oi.price) * oi.countPaid, 0);
    if (salesMap.has(dateKey)) {
      salesMap.set(dateKey, (salesMap.get(dateKey) || 0) + orderTotal);
    }
  });

  return Array.from(salesMap.entries()).map(([date, sales]) => ({ date, sales }));
}

type SalesRange = {
  start?: string;
  end?: string;
};

type SalesBucket = {
  ts: string;
  total: number;
  paid: number;
};

function parseRangeValue(value: unknown): Date | null {
  if (!value) return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
}

async function getSalesByHalfHour(eventId: string | undefined, range: SalesRange = {}) {
  const dialect = db.sequelize.options.dialect;
  const rangeQuery: Record<string, string> = {
    mysql: `SELECT MIN(orders.createdAt) AS earliest, MAX(orders.createdAt) AS latest
            FROM gmbh.orderitems
            INNER JOIN gmbh.orders ON gmbh.orderitems.orderId = gmbh.orders.id
            WHERE orders.eventId = :eventId`,
    postgres: `SELECT MIN(orders."createdAt") AS earliest, MAX(orders."createdAt") AS latest
              FROM orderitems
              INNER JOIN orders ON orderitems."orderId" = orders.id
              WHERE orders."eventId" = :eventId`
  };
  const [rangeRow] = await db.sequelize.query(rangeQuery[dialect], {
    type: db.sequelize.QueryTypes.SELECT,
    replacements: { eventId }
  });
  const { earliest, latest } = rangeRow as { earliest?: string | Date | null; latest?: string | Date | null };
  if (!earliest || !latest) {
    return { buckets: [] as SalesBucket[] };
  }
  const parsedStart = parseRangeValue(range.start);
  const parsedEnd = parseRangeValue(range.end);
  if ((range.start && !parsedStart) || (range.end && !parsedEnd)) {
    throw new Error('invalid_range');
  }
  const start = parsedStart || new Date(earliest);
  const end = parsedEnd || new Date(latest);
  if (start > end) {
    throw new Error('invalid_range');
  }

  const bucketSeconds = 30 * 60;
  const startSeconds = Math.floor(start.getTime() / 1000);
  const endSeconds = Math.ceil(end.getTime() / 1000);
  const startBucket = Math.floor(startSeconds / bucketSeconds) * bucketSeconds;
  const endBucket = Math.ceil(endSeconds / bucketSeconds) * bucketSeconds;

  const query: Record<string, string> = {
    mysql: `SELECT FLOOR(UNIX_TIMESTAMP(orders.createdAt) / :bucketSeconds) * :bucketSeconds AS bucket,
            SUM(orderitems.price * orderitems.count) AS total,
            SUM(orderitems.price * IFNULL(orderitems.countPaid, 0)) AS paid
            FROM gmbh.orderitems
            INNER JOIN gmbh.orders ON gmbh.orderitems.orderId = gmbh.orders.id
            WHERE orders.eventId = :eventId AND orders.createdAt BETWEEN :start AND :end
            GROUP BY bucket
            ORDER BY bucket`,
    postgres: `SELECT FLOOR(EXTRACT(EPOCH FROM orders."createdAt") / :bucketSeconds) * :bucketSeconds AS bucket,
              SUM(orderitems.price * orderitems."count") AS total,
              SUM(orderitems.price * COALESCE(orderitems."countPaid", 0)) AS paid
              FROM orderitems
              INNER JOIN orders ON orderitems."orderId" = orders.id
              WHERE orders."eventId" = :eventId
              AND orders."createdAt" BETWEEN :start AND :end
              GROUP BY bucket
              ORDER BY bucket`
  };

  const rows = await db.sequelize.query(query[dialect], {
    type: db.sequelize.QueryTypes.SELECT,
    replacements: { eventId, start, end, bucketSeconds }
  });

  const bucketMap = new Map<number, { total: number; paid: number }>();
  rows.forEach((row: any) => {
    const bucket = Number(row.bucket);
    bucketMap.set(bucket, {
      total: Number(row.total || 0),
      paid: Number(row.paid || 0)
    });
  });

  const buckets: SalesBucket[] = [];
  for (let bucket = startBucket; bucket <= endBucket; bucket += bucketSeconds) {
    const values = bucketMap.get(bucket);
    buckets.push({
      ts: new Date(bucket * 1000).toISOString(),
      total: values?.total || 0,
      paid: values?.paid || 0
    });
  }

  return { buckets };
}

async function getRecentOrders(eventId: string | undefined) {
  const recentOrders = await db.Order.findAll({
    where: { eventId },
    include: [
      { model: db.Orderitem },
      { model: db.Table, include: [{ model: db.Area }] }
    ],
    order: [['createdAt', 'DESC']],
    limit: 5
  });

  return recentOrders.map((order: any) => {
    const items = order.orderitems || [];
    const orderTotal = items.reduce((sum: number, oi: any) => sum + Number(oi.price) * oi.count, 0);
    const table = order.table;
    const area = table?.area;
    const tableLabel = table
      ? `Tisch ${area?.short || ''}${table.name}${area?.name ? ` (${area.name})` : ''}`
      : 'Unbekannter Tisch';
    return {
      id: order.id,
      number: order.number,
      total: orderTotal,
      tableName: tableLabel
    };
  });
}

async function getTopItems(eventId: string | undefined, limit = 15) {
  const dialect = db.sequelize.options.dialect;
  const cappedLimit = Math.max(1, Math.min(limit, 50));
  const query: Record<string, string> = {
    mysql: `SELECT items.name AS name,
            SUM(orderitems.count) AS amount,
            SUM(orderitems.price * orderitems.count) AS revenue
            FROM gmbh.orderitems
            INNER JOIN gmbh.items ON gmbh.orderitems.itemId = gmbh.items.id
            INNER JOIN gmbh.orders ON gmbh.orderitems.orderId = gmbh.orders.id
            WHERE orders.eventId = :eventId
            GROUP BY items.id
            ORDER BY amount DESC
            LIMIT :limit`,
    postgres: `SELECT items.name AS name,
              SUM(orderitems."count") AS amount,
              SUM(orderitems.price * orderitems."count") AS revenue
              FROM orderitems
              INNER JOIN items ON orderitems."itemId" = items.id
              INNER JOIN orders ON orderitems."orderId" = orders.id
              WHERE orders."eventId" = :eventId
              GROUP BY items.id
              ORDER BY amount DESC
              LIMIT :limit`
  };

  const rows = await db.sequelize.query(query[dialect], {
    type: db.sequelize.QueryTypes.SELECT,
    replacements: { eventId, limit: cappedLimit }
  });

  return rows.map((row: any) => ({
    name: row.name,
    amount: Number(row.amount || 0),
    revenue: Number(row.revenue || 0)
  }));
}

router.get('/summary', async function (req: Request, res: Response) {
  try {
    const eventId = (req as Request & { eventId?: string }).eventId;
    const totalRevenue = await getTotalRevenue(eventId);
    const [ordersCount, activeTables] = await Promise.all([
      db.Order.count({ where: { eventId } }),
      db.Table.count({ where: { enabled: true, eventId } })
    ]);
    res.send({
      totalRevenue,
      ordersCount,
      activeTables,
      averageOrderValue: ordersCount ? totalRevenue / ordersCount : 0
    });
  } catch (error: any) {
    res.status(400).send({
      errors: {
        msg: error?.errors?.[0]?.message || error?.message || 'Error on generating stats.'
      }
    });
  }
});

router.get('/sales-by-day', async function (req: Request, res: Response) {
  try {
    const eventId = (req as Request & { eventId?: string }).eventId;
    const salesByDay = await getSalesByDay(eventId);
    res.send({ salesByDay });
  } catch (error: any) {
    res.status(400).send({
      errors: {
        msg: error?.errors?.[0]?.message || error?.message || 'Error on generating stats.'
      }
    });
  }
});

router.get('/sales-by-half-hour', async function (req: Request, res: Response) {
  try {
    const eventId = (req as Request & { eventId?: string }).eventId;
    const data = await getSalesByHalfHour(eventId, {
      start: req.query.start as string | undefined,
      end: req.query.end as string | undefined
    });
    res.send({ data });
  } catch (error: any) {
    if (error?.message === 'invalid_range') {
      res.status(400).send({ errors: { msg: 'invalid date range' } });
      return;
    }
    res.status(400).send({
      errors: {
        msg: error?.errors?.[0]?.message || error?.message || 'Error on generating stats.'
      }
    });
  }
});

router.get('/recent-orders', async function (req: Request, res: Response) {
  try {
    const eventId = (req as Request & { eventId?: string }).eventId;
    const recentOrders = await getRecentOrders(eventId);
    res.send({ recentOrders });
  } catch (error: any) {
    res.status(400).send({
      errors: {
        msg: error?.errors?.[0]?.message || error?.message || 'Error on generating stats.'
      }
    });
  }
});

router.get('/top-items', async function (req: Request, res: Response) {
  try {
    const eventId = (req as Request & { eventId?: string }).eventId;
    const limitRaw = req.query.limit ? parseInt(String(req.query.limit), 10) : 15;
    const limit = Number.isFinite(limitRaw) ? limitRaw : 15;
    const items = await getTopItems(eventId, limit);
    res.send({ items });
  } catch (error: any) {
    res.status(400).send({
      errors: {
        msg: error?.errors?.[0]?.message || error?.message || 'Error on generating stats.'
      }
    });
  }
});

module.exports = router;
