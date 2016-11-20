'use strict';

const express            = require('express');
const router             = express.Router();
const db                 = require('../models/index');
const serialize          = require('../serializers/order');
const serializeOrderitem = require('../serializers/orderitem');

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
 * @apiParam {Number} id Orders unique ID.

  *@apiUse token

 * @apiSuccess {Object} order Order
 * @apiUse orderAttributes

 * @apiPermission waiter
 * @apiPermission admin
 */

router.get('/:id', function(req, res){
  db.Order.find({where: {id: req.params.id}, include: [{model: db.Orderitem}]}).then(order => {

    order = JSON.parse(JSON.stringify(order));
    mapOrderItems(order);
    mapOrderRelations(order);
    res.send({order});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

/**
 * @api {get} api/order Request all order
 * @apiGroup Order
 * @apiName Getorder

 * @apiParam {string} x-access-token JSONWebToken | Mandatory if not set as header
 * @apiHeader {string} x-access-token JSONWebToken | Mandatory if not in params

 * @apiSuccess {Object[]} order Order
 * @apiUse orderAttributes

 * @apiPermission waiter
 * @apiPermission admin
 */
 
router.get('/', function(req, res){
  db.Order.findAll({where: {userId: req.decoded.id}, include: [{model: db.Orderitem},{model: db.Order}]}).then(orders => {
    orders = JSON.parse(JSON.stringify(orders));
    for(const order of orders){
      mapOrderItems(order);
      mapOrderRelations(order);
    }

    res.send({orders});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
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

router.post('/', function(req, res){
  const requestOrder = serialize(req.body.order);
  const orderitems   = requestOrder.orderitems;
  let   orderId      = null;
  db.Order.create(requestOrder)
  .then( data => {
    orderitems.map(x => {
      x.orderId = data.id;
      x.itemId  = x.item;
    });
    orderId = data.id;
    return db.Orderitem.bulkCreate(orderitems);
  })
  .then(() => {
    return db.Order.findById(orderId, {include: [{model: db.Orderitem}]});
  })
  .then(data => {
    const order = JSON.parse(JSON.stringify(data));

    mapOrderItems(order);
    mapOrderRelations(order);

    res.send({order});
  }).catch(error => {
    throw error;
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
 * @apiParam {Number} id Orders unique ID.

 * @apiUse orderParams
 * @apiUse orderAttributes
 *
 * @apiPermission waiter
 * @apiPermission admin
 */

router.put('/:id', function(req, res){
  const requestOrder = serialize(req.body.order);
  db.Order.findById(req.params.id).then(order => {
    return order.update(serialize(req.body.order));
  }).then(() => {
    const promises = [];
    for(const orderitem of requestOrder.orderitems){
      const promise = db.Orderitem.update(serializeOrderitem(orderitem), {where: {id: orderitem.id}});

      promises.push(promise);
    }
    return Promise.all(promises);
  }).then(() => {
    return db.Order.findById(req.params.id, {include: [{model: db.Orderitem, include: [{model: db.Item}]}]});
  }).then(data => {
    const order = JSON.parse(JSON.stringify(data));

    mapOrderItems(order);
    mapOrderRelations(order);

    res.send({order});
  }).catch(error => {
   throw error;
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
 * @apiParam {number} id Id
 *
 * @apiPermission waiter
 * @apiPermission admin
 * @apiSuccess {object} object empty Object {}
 */

router.delete('/:id', function(req, res){
  db.Order.find({where: {id: req.params.id}}).then(order => {
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

function mapOrderItems(order){
  order.orderitems.map(x => {

    x.item    = x.itemId;
    x.order   = x.orderId;
    x.itemId  = undefined;
    x.orderId = undefined;
  });
}

function mapOrderRelations(order){
  order.order   = order.orderId;
  order.user    = order.userId;
  order.orderId = undefined;
  order.userId  = undefined;
}
