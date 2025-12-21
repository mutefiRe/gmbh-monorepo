"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = __importDefault(require("../../models"));
const router = (0, express_1.Router)();
function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
async function getTotalRevenue(eventId) {
    const dialect = models_1.default.sequelize.options.dialect;
    const revenueQuery = {
        mysql: 'SELECT SUM(orderitems.price * orderitems.countPaid) AS revenue FROM gmbh.orderitems INNER JOIN gmbh.orders ON orderitems.orderId = orders.id WHERE orderitems.countPaid <> 0 AND orders.eventId = :eventId',
        postgres: 'SELECT SUM(orderitems.price * "countPaid") AS revenue FROM orderitems INNER JOIN orders ON orderitems."orderId" = orders.id WHERE orderitems."countPaid" <> 0 AND orders."eventId" = :eventId'
    };
    const [revenueRow] = await models_1.default.sequelize.query(revenueQuery[dialect], {
        type: models_1.default.sequelize.QueryTypes.SELECT,
        replacements: { eventId }
    });
    return Number(revenueRow?.revenue || 0);
}
async function getSalesByDay(eventId) {
    const since = new Date();
    since.setDate(since.getDate() - 6);
    since.setHours(0, 0, 0, 0);
    const ordersForSales = await models_1.default.Order.findAll({
        where: { createdAt: { [models_1.default.Sequelize.Op.gte]: since }, eventId },
        include: [{ model: models_1.default.Orderitem }],
        order: [['createdAt', 'DESC']]
    });
    const salesMap = new Map();
    for (let i = 6; i >= 0; i -= 1) {
        const day = new Date();
        day.setDate(day.getDate() - i);
        const key = formatDateKey(day);
        salesMap.set(key, 0);
    }
    ordersForSales.forEach((order) => {
        const dateKey = formatDateKey(new Date(order.createdAt));
        const items = order.orderitems || [];
        const orderTotal = items.reduce((sum, oi) => sum + Number(oi.price) * oi.countPaid, 0);
        if (salesMap.has(dateKey)) {
            salesMap.set(dateKey, (salesMap.get(dateKey) || 0) + orderTotal);
        }
    });
    return Array.from(salesMap.entries()).map(([date, sales]) => ({ date, sales }));
}
function parseRangeValue(value) {
    if (!value)
        return null;
    const date = new Date(String(value));
    return Number.isNaN(date.getTime()) ? null : date;
}
async function getSalesByHalfHour(eventId, range = {}) {
    const dialect = models_1.default.sequelize.options.dialect;
    const rangeQuery = {
        mysql: `SELECT MIN(orders.createdAt) AS earliest, MAX(orders.createdAt) AS latest
            FROM gmbh.orderitems
            INNER JOIN gmbh.orders ON gmbh.orderitems.orderId = gmbh.orders.id
            WHERE orders.eventId = :eventId`,
        postgres: `SELECT MIN(orders."createdAt") AS earliest, MAX(orders."createdAt") AS latest
              FROM orderitems
              INNER JOIN orders ON orderitems."orderId" = orders.id
              WHERE orders."eventId" = :eventId`
    };
    const [rangeRow] = await models_1.default.sequelize.query(rangeQuery[dialect], {
        type: models_1.default.sequelize.QueryTypes.SELECT,
        replacements: { eventId }
    });
    const { earliest, latest } = rangeRow;
    if (!earliest || !latest) {
        return { buckets: [] };
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
    const query = {
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
    const rows = await models_1.default.sequelize.query(query[dialect], {
        type: models_1.default.sequelize.QueryTypes.SELECT,
        replacements: { eventId, start, end, bucketSeconds }
    });
    const bucketMap = new Map();
    rows.forEach((row) => {
        const bucket = Number(row.bucket);
        bucketMap.set(bucket, {
            total: Number(row.total || 0),
            paid: Number(row.paid || 0)
        });
    });
    const buckets = [];
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
async function getRecentOrders(eventId) {
    const recentOrders = await models_1.default.Order.findAll({
        where: { eventId },
        include: [
            { model: models_1.default.Orderitem },
            { model: models_1.default.Table, include: [{ model: models_1.default.Area }] }
        ],
        order: [['createdAt', 'DESC']],
        limit: 5
    });
    return recentOrders.map((order) => {
        const items = order.orderitems || [];
        const orderTotal = items.reduce((sum, oi) => sum + Number(oi.price) * oi.count, 0);
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
async function getTopItems(eventId, limit = 15) {
    const dialect = models_1.default.sequelize.options.dialect;
    const cappedLimit = Math.max(1, Math.min(limit, 50));
    const query = {
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
    const rows = await models_1.default.sequelize.query(query[dialect], {
        type: models_1.default.sequelize.QueryTypes.SELECT,
        replacements: { eventId, limit: cappedLimit }
    });
    return rows.map((row) => ({
        name: row.name,
        amount: Number(row.amount || 0),
        revenue: Number(row.revenue || 0)
    }));
}
router.get('/summary', async function (req, res) {
    try {
        const eventId = req.eventId;
        const totalRevenue = await getTotalRevenue(eventId);
        const [ordersCount, activeTables] = await Promise.all([
            models_1.default.Order.count({ where: { eventId } }),
            models_1.default.Table.count({ where: { enabled: true, eventId } })
        ]);
        res.send({
            totalRevenue,
            ordersCount,
            activeTables,
            averageOrderValue: ordersCount ? totalRevenue / ordersCount : 0
        });
    }
    catch (error) {
        res.status(400).send({
            errors: {
                msg: error?.errors?.[0]?.message || error?.message || 'Error on generating stats.'
            }
        });
    }
});
router.get('/sales-by-day', async function (req, res) {
    try {
        const eventId = req.eventId;
        const salesByDay = await getSalesByDay(eventId);
        res.send({ salesByDay });
    }
    catch (error) {
        res.status(400).send({
            errors: {
                msg: error?.errors?.[0]?.message || error?.message || 'Error on generating stats.'
            }
        });
    }
});
router.get('/sales-by-half-hour', async function (req, res) {
    try {
        const eventId = req.eventId;
        const data = await getSalesByHalfHour(eventId, {
            start: req.query.start,
            end: req.query.end
        });
        res.send({ data });
    }
    catch (error) {
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
router.get('/recent-orders', async function (req, res) {
    try {
        const eventId = req.eventId;
        const recentOrders = await getRecentOrders(eventId);
        res.send({ recentOrders });
    }
    catch (error) {
        res.status(400).send({
            errors: {
                msg: error?.errors?.[0]?.message || error?.message || 'Error on generating stats.'
            }
        });
    }
});
router.get('/top-items', async function (req, res) {
    try {
        const eventId = req.eventId;
        const limitRaw = req.query.limit ? parseInt(String(req.query.limit), 10) : 15;
        const limit = Number.isFinite(limitRaw) ? limitRaw : 15;
        const items = await getTopItems(eventId, limit);
        res.send({ items });
    }
    catch (error) {
        res.status(400).send({
            errors: {
                msg: error?.errors?.[0]?.message || error?.message || 'Error on generating stats.'
            }
        });
    }
});
module.exports = router;
