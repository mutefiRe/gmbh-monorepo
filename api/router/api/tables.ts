'use strict';

const express = require('express');
const router = express.Router();
const db = require('../../models');

/**
 * @apiDefine tableAttributes
 * @apiSuccess {Number}  tables.id Autoincremented Identifier of the table
 * @apiSuccess {Number}  tables.area Id of the Area
 * @apiSuccess {String}  tables.name
 * @apiSuccess {Number}  tables.x
 * @apiSuccess {Number}  tables.y
 * @apiSuccess {Boolean} tables.custom
 * @apiSuccess {Boolean} tables.enabled
 */

/**
 * @apiDefine tableParams
 * @apiParam {Number}  tables.id
 * @apiParam {String}  tables.area Id of the Area
 * @apiParam {String}  tables.name
 * @apiParam {Number}  tables.x
 * @apiParam {Number}  tables.y
 * @apiParam {Boolean} tables.custom
 * @apiParam {Boolean} tables.enabled
 */

/**
 * @api {get} api/tables/:id Request Table
 * @apiGroup Table
 * @apiName GetTable
 * @apiParam {number} string Tables unique ID.

  *@apiUse token

 * @apiSuccess {Object} tables Table
 * @apiUse tableAttributes

 * @apiPermission waiter
 * @apiPermission admin
 */

router.get('/:id', function (req, res) {
  db.Table.findOne({ where: { id: req.params.id, eventId: req.eventId } }).then(table => {
    res.send({ table });
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

/**
 * @api {get} api/tables Request all tables
 * @apiGroup Table
 * @apiName Gettables

 * @apiParam {string} x-access-token JSONWebToken | Mandatory if not set as header
 * @apiHeader {string} x-access-token JSONWebToken | Mandatory if not in params

 * @apiSuccess {Object[]} tables Table
 * @apiUse tableAttributes

 * @apiPermission waiter
 * @apiPermission admin
 */

router.get('/', function (req, res) {
  db.Table.findAll({ where: { eventId: req.eventId } }).then(tables => {
    res.send({ tables });
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

/**
 * @api {post} api/tables/ Create one table
 * @apiGroup Table
 * @apiName PostTable
 * @apiUse token
 * @apiParam {Object} tables
 * @apiUse tableParams
 * @apiUse tableAttributes
 *
 * @apiPermission admin
 */

router.post('/', function (req, res) {
  const io = req.app.get('io');
  let table = req.body.table;

  db.Table.create({ ...req.body.table, eventId: req.eventId }).then(table => {
    io.sockets.emit("update", { table, eventId: req.eventId });
    res.send({ table });
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });

  });

});

/**
 * @api {put} api/tables/:id Update one table
 * @apiGroup Table
 * @apiName UpdateTable
 * @apiUse token
 * @apiParam {Object} tables
 * @apiUse tableAttributes
 * @apiSuccess {Object} tables
 * @apiParam {number} string
 * @apiUse tableParams
 *
 * @apiPermission admin
 */

router.put('/:id', function (req, res) {
  const io = req.app.get('io');
  db.Table.findOne({ where: { id: req.params.id, eventId: req.eventId } }).then(table => {
    if (table === null) throw new Error('table not found');
    return table.update({ ...req.body.table, eventId: req.eventId });
  }).then(table => {
    res.send({ table });
    io.sockets.emit("update", { table, eventId: req.eventId });
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

/**
 * @api {delete} api/tables/:id Delete one table
 * @apiGroup Table
 * @apiName DeleteTable
 * @apiParam {number} string Id
 *
 * @apiPermission admin
 * @apiSuccess {object} object empty Object {}
 */

router.delete('/:id', function (req, res) {
  const io = req.app.get('io');
  db.Table.findOne({ where: { id: req.params.id, eventId: req.eventId } }).then(table => {
    if (table === null) throw new Error('table not found');
    return table.destroy().then(() => table);
  }).then((table) => {
    res.send({});
    io.sockets.emit("delete", { 'type': 'table', 'id': table.id, eventId: req.eventId });
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

module.exports = router;
