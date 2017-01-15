'use strict';

const router    = require('express').Router();
const db        = require('../../models');

/**
 * @apiDefine itemAttributes
 * @apiSuccess {Number}  items.id Autoincremented Identifier of the item
 * @apiSuccess {String}  items.name Name of the item
 * @apiSuccess {Number}  items.amount Id of the Area
 * @apiSuccess {Number}  items.price Price of one item
 * @apiSuccess {Number}  items.tax Tax of the item
 * @apiSuccess {Number}  items.sort the sort order of the items
 * @apiSuccess {Number}  items.category Id of the cateogry
 * @apiSuccess {Number}  items.unit Id of the unit
 */

/**
 * @apiDefine itemParams
 * @apiSuccess {Number}  items.id Autoincremented Identifier of the item
 * @apiSuccess {String}  items.name Name of the item
 * @apiSuccess {Number}  items.amount Id of the Area
 * @apiSuccess {Number}  items.price Price of one item
 * @apiSuccess {Number}  items.tax Tax of the item
 * @apiSuccess {Number}  items.sort the sort order of the items
 * @apiSuccess {Number}  items.category Id of the cateogry
 * @apiSuccess {Number}  items.unit Id of the unit
 */

/**
 * @api {get} api/items/:id Request Item
 * @apiGroup Item
 * @apiName GetItem
 * @apiParam {Number} id Items unique ID.

  *@apiUse token

 * @apiSuccess {Object} items Item
 * @apiUse itemAttributes

 * @apiPermission waiter
 * @apiPermission admin
 */

router.get('/:id', function(req, res){
  db.Item.find({where: {id: req.params.id}}).then(item => {
    if(item === null) throw new Error("item not found");
    else {
      res.send({item});
    }
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

/**
 * @api {get} api/items Request all items
 * @apiGroup Item
 * @apiName Getitems

 * @apiParam {string} x-access-token JSONWebToken | Mandatory if not set as header
 * @apiHeader {string} x-access-token JSONWebToken | Mandatory if not in params

 * @apiSuccess {Object[]} items Item
 * @apiUse itemAttributes

 * @apiPermission waiter
 * @apiPermission admin
 */

router.get('/', function(req, res){
  db.Item.findAll().then(items => {
    res.send({items});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

/**
 * @api {post} api/items/ Create one item
 * @apiGroup Item
 * @apiName PostItem
 * @apiUse token
 * @apiParam {Object} items
 * @apiUse itemParams
 * @apiUse itemAttributes
 *
 * @apiPermission waiter
 * @apiPermission admin
 */

router.post('/', function(req, res){
  const io = req.app.get('io');
  db.Item.create(req.body.item).then(item => {
    res.send({item});
    io.sockets.emit("update", {item});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

/**
 * @api {put} api/items/:id Update one item
 * @apiGroup Item
 * @apiName UpdateItem
 * @apiUse token
 * @apiParam {Object} items
 * @apiSuccess {Object} items
 * @apiParam {Number} id
 * @apiUse itemParams
 * @apiUse itemAttributes
 *
 * @apiPermission waiter
 * @apiPermission admin
 */

router.put('/:id', function(req, res){
  const io = req.app.get('io');
  db.Item.find({where: {id: req.params.id}}).then(item => {
    if(item === null) throw new Error("item not found");
    return item.update(req.body.item);
  }).then(item => {
    res.send({item});
    io.sockets.emit("update", {item});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

/**
 * @api {delete} api/items/:id Delete one item
 * @apiGroup Item
 * @apiName DeleteItem
 * @apiParam {number} id Id
 *
 * @apiPermission waiter
 * @apiPermission admin
 * @apiSuccess {object} object empty Object {}
 */

router.delete('/:id', function(req, res){
  const io = req.app.get('io');
  db.Item.destroy({where: {id: req.params.id}}).then(() => {
    res.send({});
    io.sockets.emit("delete", {'type': 'item', 'id': item.id});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

module.exports = router;
