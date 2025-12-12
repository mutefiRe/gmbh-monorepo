'use strict';

const router = require('express').Router();
const db = require('../../models');

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
 * @apiSuccess {Boolean}  items.enabled the flag if items should be enabled
 */

/**
 * @apiDefine itemParams
 * @apiParam {Number}  items.id Autoincremented Identifier of the item
 * @apiParam {String}  items.name Name of the item
 * @apiParam {Number}  items.amount Id of the Area
 * @apiParam {Number}  items.price Price of one item
 * @apiParam {Number}  items.tax Tax of the item
 * @apiParam {Number}  items.sort the sort order of the items
 * @apiParam {Number}  items.category Id of the cateogry
 * @apiParam {Number}  items.unit Id of the unit
 * @apiParam {Boolean} items.enabled the flag if items should be enabled
 */

/**
 * @api {get} api/items/:id Request Item
 * @apiGroup Item
 * @apiName GetItem
 * @apiParam {number} string Items unique ID.

  *@apiUse token

 * @apiSuccess {Object} items Item
 * @apiUse itemAttributes

 * @apiPermission waiter
 * @apiPermission admin
 */

router.get('/:id', function (req, res) {
  db.Item.findOne({ where: { id: req.params.id } }).then(item => {
    if (item === null) throw new Error("item not found");
    else {
      res.send({ item });
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

router.get('/', async function (req, res) {
  try {
    const items = await db.Item.findAll();
    res.send({ items });
  } catch (error) {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  }
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
 * @apiPermission admin
 */

router.post('/', async function (req, res) {
  const io = req.app.get('io');
  try {
    const item = await db.Item.create(req.body.item);
    res.send({ item });
    io.sockets.emit("update", { item });
  } catch (error) {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  }
});

/**
 * @api {put} api/items/:id Update one item
 * @apiGroup Item
 * @apiName UpdateItem
 * @apiUse token
 * @apiParam {Object} items
 * @apiSuccess {Object} items
 * @apiParam {number} string
 * @apiUse itemParams
 * @apiUse itemAttributes
 *
 * @apiPermission admin
 */

router.put('/:id', async function (req, res) {
  const io = req.app.get('io');
  try {
    const item = await db.Item.findOne({ where: { id: req.params.id } });
    if (item === null) throw new Error("item not found");
    const updatedItem = await item.update(req.body.item);
    res.send({ item });
    io.sockets.emit("update", { item });
  } catch (error) {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  }
});

/**
 * @api {delete} api/items/:id Delete one item
 * @apiGroup Item
 * @apiName DeleteItem
 * @apiParam {number} string Id
 *
 * @apiPermission admin
 * @apiSuccess {object} object empty Object {}
 */

router.delete('/:id', async function (req, res) {
  const io = req.app.get('io');
  try {
    await db.Item.destroy({ where: { id: req.params.id } });
    res.send({});
    io.sockets.emit("delete", { 'type': 'item', 'id': req.params.id });
  } catch (error) {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  }
});

module.exports = router;
