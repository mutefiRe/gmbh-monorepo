"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = __importDefault(require("../../models"));
const logger_1 = __importDefault(require("../../util/logger"));
const router = (0, express_1.Router)();
router.get('/:id', async function (req, res) {
    try {
        const order = await models_1.default.Order.findOne({
            where: { id: req.params.id, eventId: req.eventId },
            include: [{ model: models_1.default.Orderitem }]
        });
        res.send({ order: JSON.parse(JSON.stringify(order)) });
    }
    catch (error) {
        res.status(400).send({
            errors: {
                msg: error?.errors?.[0]?.message || error?.message
            }
        });
    }
});
router.get('/', async function (req, res) {
    try {
        const eventId = req.eventId;
        const skip = parseInt(String(req.query.skip || '0'), 10) || 0;
        const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : null;
        const findOptions = {
            include: [{ model: models_1.default.Orderitem }],
            order: [['createdAt', 'DESC']],
            offset: skip,
            where: { eventId }
        };
        if (limit !== null && !Number.isNaN(limit)) {
            findOptions.limit = limit;
        }
        const total = await models_1.default.Order.count({ where: { eventId } });
        const orders = await models_1.default.Order.findAll(findOptions);
        const count = orders.length;
        res.send({ orders: JSON.parse(JSON.stringify(orders)), count, total });
    }
    catch (error) {
        res.status(400).send({
            errors: {
                msg: error?.errors?.[0]?.message || error?.message
            }
        });
    }
});
router.get('/byuser/:userId', async function (req, res) {
    try {
        const eventId = req.eventId;
        const skip = parseInt(String(req.query.skip || '0'), 10) || 0;
        const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : null;
        const findOptions = {
            where: { userId: req.params.userId, eventId },
            include: [{ model: models_1.default.Orderitem }],
            order: [['createdAt', 'DESC']],
            offset: skip
        };
        if (limit !== null && !Number.isNaN(limit)) {
            findOptions.limit = limit;
        }
        const total = await models_1.default.Order.count({ where: { userId: req.params.userId, eventId } });
        const orders = await models_1.default.Order.findAll(findOptions);
        const count = orders.length;
        res.send({ orders: JSON.parse(JSON.stringify(orders)), count, total });
    }
    catch (error) {
        res.status(400).send({
            errors: {
                msg: error?.errors?.[0]?.message || error?.message
            }
        });
    }
});
router.post('/', async function (req, res) {
    const userId = req.decoded?.id || null;
    const eventId = req.eventId;
    try {
        const requestOrder = req.body.order;
        let order = null;
        if (requestOrder?.id) {
            order = await models_1.default.Order.findOne({ where: { id: requestOrder.id } });
        }
        if (order) {
            return res.send({ order });
        }
        if (!requestOrder || !requestOrder.orderitems?.length) {
            logger_1.default.error('No order or orderitems provided in create order request');
            return res.status(400).send({
                errors: {
                    msg: 'No order provided'
                }
            });
        }
        requestOrder.userId = userId;
        requestOrder.eventId = eventId;
        const orderitems = requestOrder.orderitems;
        const createdOrder = await models_1.default.Order.create(requestOrder);
        orderitems.map((orderitem) => {
            orderitem.orderId = createdOrder.id;
        });
        await models_1.default.Orderitem.bulkCreate(orderitems);
        const data = await models_1.default.Order.findOne({
            where: { id: createdOrder.id },
            include: [{ model: models_1.default.Orderitem }]
        });
        const created = JSON.parse(JSON.stringify(data));
        logger_1.default.info(`Created order ${created.id} with ${created.orderitems.length} items`);
        res.send({ order: created });
    }
    catch (error) {
        logger_1.default.error(`Error creating order: ${error?.message || error}`);
        res.status(400).send({
            errors: {
                msg: error?.errors?.[0]?.message || error?.message
            }
        });
    }
});
router.put('/:id', async function (req, res) {
    try {
        const requestOrder = req.body.order;
        const order = await models_1.default.Order.findOne({
            where: { id: req.params.id, eventId: req.eventId }
        });
        if (!order) {
            throw new Error('order not found');
        }
        await order.update({ ...req.body.order, eventId: req.eventId });
        const promises = [];
        for (const orderitem of requestOrder.orderitems || []) {
            Reflect.deleteProperty(orderitem, 'createdAt');
            Reflect.deleteProperty(orderitem, 'createdAt');
            const promise = models_1.default.Orderitem.update(orderitem, { where: { id: orderitem.id } });
            promises.push(promise);
        }
        await Promise.all(promises);
        const updated = await models_1.default.Order.findOne({
            where: { id: req.params.id, eventId: req.eventId },
            include: [{ model: models_1.default.Orderitem }]
        });
        res.send({ order: updated });
    }
    catch (error) {
        res.status(400).send({
            errors: {
                msg: error?.errors?.[0]?.message || error?.message
            }
        });
    }
});
router.delete('/:id', async function (req, res) {
    try {
        const order = await models_1.default.Order.findOne({
            where: { id: req.params.id, eventId: req.eventId }
        });
        if (!order) {
            throw new Error('order not found');
        }
        await order.destroy();
        res.send({});
    }
    catch (error) {
        res.status(400).send({
            errors: {
                msg: error?.errors?.[0]?.message || error?.message
            }
        });
    }
});
exports.default = router;
