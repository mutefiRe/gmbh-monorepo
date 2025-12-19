'use strict';

const router = require('express').Router();
const db = require('../../models');
const logger = require('../../util/logger');

/**
 * @apiDefine orderAttributes
 * @apiSuccess {Number}  order.id Autoincremented Identifier of the order
 * @apiSuccess {Number}  order.totalAmount Sum of the not paid orderitems
 * @apiSuccess {Number}  order.user
 * @apiSuccess {Number}  order.table
 * @apiSuccess {Object[]}  order.orderitems
 * @apiSuccess {Number}  order.orderitems.id        Autoincremented Identifier of the orderitem
 * @apiSuccess {String}  order.orderitems.extras    Extra for the item
 * @apiSuccess {Number}  order.orderitems.count     Amount of items
 * @apiSuccess {Number}  order.orderitems.countPaid Amount of paid items
 * @apiSuccess {Number}  order.orderitems.countFree Amount of free items
 * @apiSuccess {Number}  order.orderitems.price     Price of the Item at this time
 * @apiSuccess {Number}  order.orderitems.order     ID of the whole Order
 */

/**
 * @apiDefine orderParams
 * @apiParam {Number}  order.id Autoincremented Identifier of the order
 * @apiParam {Number}  order.totalAmount Sum of the not paid orderitems
 * @apiParam {Number}  order.user
 * @apiParam {Number}  order.table
 * @apiParam {Object[]}  order.orderitems
 * @apiParam {Number}  order.orderitems.id        Autoincremented Identifier of the orderitem
 * @apiParam {String}  order.orderitems.extras    Extra for the item
 * @apiParam {Number}  order.orderitems.count     Amount of items
 * @apiParam {Number}  order.orderitems.countPaid Amount of paid items
 * @apiParam {Number}  order.orderitems.countFree Amount of free items
 * @apiParam {Number}  order.orderitems.price     Price of the Item at this time
 * @apiParam {Number}  order.orderitems.order     ID of the whole Order
 */

/**
 * @api {get} api/order/:id Request Order
 * @apiGroup Order
 * @apiName GetOrder
 * @apiParam {number} string Orders unique ID.

  *@apiUse token

 * @apiSuccess {Object} order Order
 * @apiUse orderAttributes

 * @apiPermission waiter
 * @apiPermission admin
 */

router.get('/:id', function (req, res) {
  db.Order.findOne({ where: { id: req.params.id }, include: [{ model: db.Orderitem }] }).then(order => {

    order = JSON.parse(JSON.stringify(order));
    res.send({ order });
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});


/**
 * @api {get} api/orders Request all order
 * @apiGroup Order
 * @apiName Getorder

 * @apiParam {string} x-access-token JSONWebToken | Mandatory if not set as header
 * @apiHeader {string} x-access-token JSONWebToken | Mandatory if not in params

 * @apiSuccess {Object[]} order Order
 * @apiUse orderAttributes

 * @apiPermission waiter
 * @apiPermission admin
 */

router.get('/', async function (req, res) {
  try {
    const skip = parseInt(req.query.skip, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || null;
    const findOptions = {
      include: [{ model: db.Orderitem }],
      order: [['createdAt', 'DESC']],
      offset: skip
    };
    if (limit !== null) {
      findOptions.limit = limit;
    }

    // Get total count
    const total = await db.Order.count();
    // Get paginated orders
    const orders = await db.Order.findAll(findOptions);
    const count = orders.length;
    res.send({ orders: JSON.parse(JSON.stringify(orders)), count, total });
  } catch (error) {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  }
});

/**
 * @api {get} api/orders/byuser/:userId Request all order
 * @apiGroup Order
 * @apiName Getorder

 * @apiParam {string} x-access-token JSONWebToken | Mandatory if not set as header
 * @apiHeader {string} x-access-token JSONWebToken | Mandatory if not in params

 * @apiSuccess {Object[]} order Order
 * @apiUse orderAttributes

 * @apiPermission waiter
 * @apiPermission admin
 */

router.get('/byuser/:userId', async function (req, res) {
  try {
    const skip = parseInt(req.query.skip, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || null;
    const findOptions = {
      where: { userId: req.params.userId },
      include: [{ model: db.Orderitem }],
      order: [['createdAt', 'DESC']],
      offset: skip
    };
    if (limit !== null) {
      findOptions.limit = limit;
    }

    // Get total count for this user
    const total = await db.Order.count({ where: { userId: req.params.userId } });
    // Get paginated orders
    const orders = await db.Order.findAll(findOptions);
    const count = orders.length;
    res.send({ orders: JSON.parse(JSON.stringify(orders)), count, total });
  } catch (error) {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  }
});


/**
 * @api {post} api/order/ Create one order
 * @apiGroup Order
 * @apiName PostOrder
 * @apiUse token
 * @apiParam {Object} order
 * @apiUse orderParams
 * @apiUse orderAttributes
 *
 * @apiPermission waiter
 * @apiPermission admin
 */

router.post('/', async function (req, res) {
  const userId = req.decoded?.id || null;

  let order;
  if (req.body.order?.id) {
    order = await db.Order.findOne({ where: { id: req.body.order.id } });
  }
  if (order) {
    // Order already exists, return it, not sure if this really should not be updated with anything from the request
    return res.send({ order });
  }

  const requestOrder = req.body.order;
  if (!requestOrder || !requestOrder.orderitems?.length) {
    logger.error('No order or orderitems provided in create order request');
    return res.status(400).send({
      'errors': {
        'msg': 'No order provided'
      }
    });
  }
  requestOrder.userId = userId;
  const orderitems = requestOrder.orderitems;
  let orderId = null;
  db.Order.create(requestOrder).then(order => {
    orderitems.map(orderitem => {
      orderitem.orderId = order.id;
    });
    orderId = order.id;
    return db.Orderitem.bulkCreate(orderitems);
  }).then(() => {
    return db.Order.findOne({ where: { id: orderId }, include: [{ model: db.Orderitem }] });
  }).then(data => {
    const order = JSON.parse(JSON.stringify(data));
    logger.info(`Created order ${order.id} with ${order.orderitems.length} items`);
    res.send({ order });
  }).catch(error => {
    logger.error(`Error creating order: ${error.message}`);
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });

});

/**
 * @api {put} api/order/:id Update one order
 * @apiGroup Order
 * @apiName UpdateOrder
 * @apiUse token
 * @apiParam {Object} order
 * @apiSuccess {Object} order
 * @apiParam {number} string Orders unique ID.

 * @apiUse orderParams
 * @apiUse orderAttributes
 *
 * @apiPermission waiter
 * @apiPermission admin
 */

router.put('/:id', function (req, res) {
  const requestOrder = req.body.order;
  db.Order.findOne({ where: { id: req.params.id } }).then(order => {
    return order.update(req.body.order);
  }).then(() => {
    const promises = [];
    for (const orderitem of requestOrder.orderitems) {
      Reflect.deleteProperty(orderitem, 'createdAt');
      Reflect.deleteProperty(orderitem, 'createdAt');
      const promise = db.Orderitem.update(orderitem, { where: { id: orderitem.id } });
      promises.push(promise);
    }
    return Promise.all(promises);
  }).then(() => {
    return db.Order.findOne({ where: { id: req.params.id }, include: [{ model: db.Orderitem }] });
  }).then(order => {
    res.send({ order });
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

/**
 * @api {delete} api/order/:id Delete one order
 * @apiGroup Order
 * @apiName DeleteOrder
 * @apiParam {number} string Id
 *
 * @apiPermission admin
 * @apiSuccess {object} object empty Object {}
 */

router.delete('/:id', function (req, res) {
  db.Order.find({ where: { id: req.params.id } }).then(order => {
    return order.destroy();
  }).then(() => {
    res.send({});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

module.exports = router;
