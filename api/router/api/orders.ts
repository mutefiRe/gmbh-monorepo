import { Router, type Request, type Response } from 'express';
import db from '../../models';
const logger = require('../../util/logger');

interface AuthenticatedRequest extends Request {
  decoded?: {
    id?: string;
  };
  eventId?: string;
}

const router = Router();

router.get('/:id', async function (req: Request, res: Response) {
  try {
    const order = await db.Order.findOne({
      where: { id: req.params.id, eventId: (req as AuthenticatedRequest).eventId },
      include: [{ model: db.Orderitem }]
    });
    res.send({ order: JSON.parse(JSON.stringify(order)) });
  } catch (error: any) {
    res.status(400).send({
      errors: {
        msg: error?.errors?.[0]?.message || error?.message
      }
    });
  }
});

router.get('/', async function (req: Request, res: Response) {
  try {
    const eventId = (req as AuthenticatedRequest).eventId;
    const skip = parseInt(String(req.query.skip || '0'), 10) || 0;
    const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : null;
    const findOptions: Record<string, unknown> = {
      include: [{ model: db.Orderitem }],
      order: [['createdAt', 'DESC']],
      offset: skip,
      where: { eventId }
    };
    if (limit !== null && !Number.isNaN(limit)) {
      findOptions.limit = limit;
    }

    const total = await db.Order.count({ where: { eventId } });
    const orders = await db.Order.findAll(findOptions);
    const count = orders.length;
    res.send({ orders: JSON.parse(JSON.stringify(orders)), count, total });
  } catch (error: any) {
    res.status(400).send({
      errors: {
        msg: error?.errors?.[0]?.message || error?.message
      }
    });
  }
});

router.get('/byuser/:userId', async function (req: Request, res: Response) {
  try {
    const eventId = (req as AuthenticatedRequest).eventId;
    const skip = parseInt(String(req.query.skip || '0'), 10) || 0;
    const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : null;
    const findOptions: Record<string, unknown> = {
      where: { userId: req.params.userId, eventId },
      include: [{ model: db.Orderitem }],
      order: [['createdAt', 'DESC']],
      offset: skip
    };
    if (limit !== null && !Number.isNaN(limit)) {
      findOptions.limit = limit;
    }

    const total = await db.Order.count({ where: { userId: req.params.userId, eventId } });
    const orders = await db.Order.findAll(findOptions);
    const count = orders.length;
    res.send({ orders: JSON.parse(JSON.stringify(orders)), count, total });
  } catch (error: any) {
    res.status(400).send({
      errors: {
        msg: error?.errors?.[0]?.message || error?.message
      }
    });
  }
});

router.post('/', async function (req: AuthenticatedRequest, res: Response) {
  const userId = req.decoded?.id || null;
  const eventId = req.eventId;
  const io = req.app.get('io');

  try {
    const requestOrder = req.body.order;
    let order = null;
    if (requestOrder?.id) {
      order = await db.Order.findOne({
        where: { id: requestOrder.id, eventId },
        include: [{ model: db.Orderitem }]
      });
    }
    if (order) {
      return res.send({ order });
    }

    if (!requestOrder || !requestOrder.orderitems?.length) {
      logger.error('No order or orderitems provided in create order request');
      return res.status(400).send({
        errors: {
          msg: 'No order provided'
        }
      });
    }

    const orderitems = requestOrder.orderitems;
    const createdOrder = await db.sequelize.transaction(async (transaction: any) => {
      const created = await db.Order.create(
        { ...requestOrder, userId, eventId },
        { transaction }
      );
      const items = orderitems.map((orderitem: Record<string, unknown>) => ({
        ...orderitem,
        orderId: created.id
      }));
      await db.Orderitem.bulkCreate(items, { transaction });
      return created;
    });
    const data = await db.Order.findOne({
      where: { id: createdOrder.id, eventId },
      include: [{ model: db.Orderitem }]
    });
    const created = JSON.parse(JSON.stringify(data));
    logger.info(`Created order ${created.id} with ${created.orderitems.length} items`);
    res.send({ order: created });
    io.sockets.emit("update", { type: 'order', id: created.id, eventId });
  } catch (error: any) {
    logger.error(`Error creating order: ${error?.message || error}`);
    res.status(400).send({
      errors: {
        msg: error?.errors?.[0]?.message || error?.message
      }
    });
  }
});

router.put('/:id', async function (req: Request, res: Response) {
  const io = req.app.get('io');
  try {
    const requestOrder = req.body.order;
    if (requestOrder?.id && requestOrder.id !== req.params.id) {
      return res.status(400).send({
        errors: {
          msg: 'order id cannot be changed'
        }
      });
    }
    const order = await db.Order.findOne({
      where: { id: req.params.id, eventId: (req as AuthenticatedRequest).eventId }
    });
    if (!order) {
      throw new Error('order not found');
    }
    await db.sequelize.transaction(async (transaction: any) => {
      await order.update({ ...req.body.order, eventId: (req as AuthenticatedRequest).eventId }, { transaction });
      const promises: Promise<unknown>[] = [];
      for (const orderitem of requestOrder.orderitems || []) {
        Reflect.deleteProperty(orderitem, 'createdAt');
        Reflect.deleteProperty(orderitem, 'createdAt');
        const promise = db.Orderitem.update(orderitem, { where: { id: orderitem.id }, transaction });
        promises.push(promise);
      }
      await Promise.all(promises);
    });

    const updated = await db.Order.findOne({
      where: { id: req.params.id, eventId: (req as AuthenticatedRequest).eventId },
      include: [{ model: db.Orderitem }]
    });
    res.send({ order: updated });
    io.sockets.emit("update", { type: 'order', id: req.params.id, eventId: (req as AuthenticatedRequest).eventId });
  } catch (error: any) {
    res.status(400).send({
      errors: {
        msg: error?.errors?.[0]?.message || error?.message
      }
    });
  }
});

router.delete('/:id', async function (req: Request, res: Response) {
  const io = req.app.get('io');
  try {
    const order = await db.Order.findOne({
      where: { id: req.params.id, eventId: (req as AuthenticatedRequest).eventId }
    });
    if (!order) {
      throw new Error('order not found');
    }
    await order.destroy();
    res.send({});
    io.sockets.emit("delete", { type: 'order', id: req.params.id, eventId: (req as AuthenticatedRequest).eventId });
  } catch (error: any) {
    res.status(400).send({
      errors: {
        msg: error?.errors?.[0]?.message || error?.message
      }
    });
  }
});

module.exports = router;
