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
router.get('/', async function (req, res) {
    try {
        const dialect = models_1.default.sequelize.options.dialect;
        const eventId = req.eventId;
        const revenueQuery = {
            mysql: 'SELECT SUM(orderitems.price * `count`) AS revenue FROM gmbh.orderitems INNER JOIN gmbh.orders ON orderitems.orderId = orders.id WHERE orders.eventId = :eventId',
            postgres: 'SELECT SUM(orderitems.price * "count") AS revenue FROM orderitems INNER JOIN orders ON orderitems."orderId" = orders.id WHERE orders."eventId" = :eventId'
        };
        const [revenueRow] = await models_1.default.sequelize.query(revenueQuery[dialect], {
            type: models_1.default.sequelize.QueryTypes.SELECT,
            replacements: { eventId }
        });
        const totalRevenue = Number(revenueRow?.revenue || 0);
        const [ordersCount, activeTables] = await Promise.all([
            models_1.default.Order.count({ where: { eventId } }),
            models_1.default.Table.count({ where: { enabled: true, eventId } })
        ]);
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
            const orderTotal = items.reduce((sum, oi) => sum + Number(oi.price) * oi.count, 0);
            if (salesMap.has(dateKey)) {
                salesMap.set(dateKey, (salesMap.get(dateKey) || 0) + orderTotal);
            }
        });
        const salesByDay = Array.from(salesMap.entries()).map(([date, sales]) => ({ date, sales }));
        const recentOrders = await models_1.default.Order.findAll({
            where: { eventId },
            include: [
                { model: models_1.default.Orderitem },
                { model: models_1.default.Table, include: [{ model: models_1.default.Area }] }
            ],
            order: [['createdAt', 'DESC']],
            limit: 5
        });
        const recent = recentOrders.map((order) => {
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
        res.send({
            totalRevenue,
            ordersCount,
            activeTables,
            averageOrderValue: ordersCount ? totalRevenue / ordersCount : 0,
            salesByDay,
            recentOrders: recent
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
exports.default = router;
