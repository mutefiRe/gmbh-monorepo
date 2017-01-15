'use strict';

const router    = require('express').Router();
const db        = require('../../models');
const serialize = require('../../serializers/orderitem');

/**
 * @apiDefine orderitemAttributes
 * @apiSuccess {Number}  orderitems.id        Autoincremented Identifier of the orderitem
 * @apiSuccess {String}  orderitems.extras    Extra for the item
 * @apiSuccess {Number}  orderitems.count     Amount of items
 * @apiSuccess {Number}  orderitems.countPaid Amount of paid items
 * @apiSuccess {Number}  orderitems.countFree Amount of free items
 * @apiSuccess {Number}  orderitems.price     Price of the Item at this time
 * @apiSuccess {Number}  orderitems.order     ID of the whole Order
 * @apiSuccess {Number}  orderitems.item     ID of the Item
 */

/**
 * @apiDefine orderitemParams
 * @apiParam {Number}  orderitems.id        Autoincremented Identifier of the orderitem
 * @apiParam {String}  orderitems.extras    Extra for the item
 * @apiParam {Number}  orderitems.count     Amount of items
 * @apiParam {Number}  orderitems.countPaid Amount of paid items
 * @apiParam {Number}  orderitems.countFree Amount of free items
 * @apiParam {Number}  orderitems.price     Price of the Item at this time
 * @apiParam {Number}  orderitems.order     ID of the whole Order
 * @apiParam {Number}  orderitems.item     ID of the whole Item
 */

/**
 * @api {get} api/orderitems/:id Request Orderitem
 * @apiGroup Orderitem
 * @apiName GetOrderitem
 * @apiParam {Number} id Orderitems unique ID.

  *@apiUse token

 * @apiSuccess {Object} orderitems Orderitem
 * @apiUse orderitemAttributes

 * @apiPermission waiter
 * @apiPermission admin
 */

router.get('/:id', function(req, res){
  db.Orderitem.find({where: {id: req.params.id}}).then(data => {
    if(data === null){
      res.status(404).send("couldn't find item");
      return;
    }
    res.send({'item':data});
  });
});

/**
 * @api {get} api/orderitems Request all orderitems
 * @apiGroup Orderitem
 * @apiName Getorderitems

 * @apiParam {string} x-access-token JSONWebToken | Mandatory if not set as header
 * @apiHeader {string} x-access-token JSONWebToken | Mandatory if not in params

 * @apiSuccess {Object[]} orderitems Orderitem
 * @apiUse orderitemAttributes

 * @apiPermission waiter
 * @apiPermission admin
 */

router.get('/', function(req, res, next){
  db.Orderitem.findAll({include: [{model: db.Item}, {model: db.Order, where: {userId: req.decoded.id}}]}).then(orderitems => {
    orderitems = JSON.parse(JSON.stringify(orderitems));
    res.body = {orderitems};
    next();
  });
});

/**
 * @api {post} api/orderitems/ Create one orderitem
 * @apiGroup Orderitem
 * @apiName PostOrderitem
 * @apiUse token
 * @apiParam {Object} orderitems
 * @apiUse orderitemParams
 * @apiUse orderitemAttributes
 *
 * @apiPermission waiter
 */

router.post('/', function(req, res, next){
  db.Orderitem.create(serialize(req.body.orderitem)).then( orderitem => {
    orderitem = JSON.parse(JSON.stringify(orderitem));
    res.body = {orderitem};
    next();
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

/**
 * @api {put} api/orderitems/:id Update one orderitem
 * @apiGroup Orderitem
 * @apiName UpdateOrderitem
 * @apiUse token
 * @apiParam {Object} orderitems
 * @apiSuccess {Object} orderitems
 * @apiUse orderitemParams
 * @apiUse orderitemAttributes
 *
 * @apiPermission waiter
 */

router.put('/:id', function(req, res, next){
  // const io = req.app.get('io');
  db.Orderitem.update(serialize(req.body.orderitem), {where: {id: req.params.id}})
  .then(() => {
    return db.Orderitem.findById(req.params.id);
  }).then(orderitem => {
    orderitem = JSON.parse(JSON.stringify(orderitem));
    res.body = {orderitem};
    next();
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

/**
 * @api {delete} api/orderitems/:id Delete one orderitem
 * @apiGroup Orderitem
 * @apiName DeleteOrderitem
 * @apiParam {number} id Id
 *
 * @apiPermission waiter
 * @apiPermission admin
 * @apiSuccess {object} object empty Object {}
 */

router.delete('/:id', function(req, res){
  db.Orderitem.find({where: {id: req.params.id}}).then(item => {
    if(item === null){
      res.status(404).send({
        'errors': {
          'msg': error && error.errors && error.errors[0].message || error.message
        }
      });
      return;
    }
    item.destroy().then(() => {
      res.send({});
    });
  });
});

module.exports = router;
