'use strict';

const express = require('express');
const router = express.Router();
const db = require('../models/index');
const serialize = require('../serializers/table');

/**
 * @apiDefine tableAttributes
 * @apiSuccess {Number}  tables.id Autoincremented Identifier of the table
 * @apiSuccess {Number}  tables.area Id of the Area
 * @apiSuccess {String}  tables.name
 * @apiSuccess {Number}  tables.x
 * @apiSuccess {Number}  tables.y
 */

/**
 * @apiDefine tableParams
 * @apiParam {Number}  tables.id
 * @apiParam {String}  tables.area Id of the Area
 * @apiParam {String}  tables.name
 * @apiParam {Number}  tables.x
 * @apiParam {Number}  tables.y
 */

/**
 * @api {get} api/tables/:id Request Table
 * @apiGroup Table
 * @apiName GetTable
 * @apiParam {Number} id Tables unique ID.

  *@apiUse token

 * @apiSuccess {Object} tables Table
 * @apiUse tableAttributes

 * @apiPermission waiter
 * @apiPermission admin
 */

router.get('/:id', function(req, res, next){
  db.Table.find({where: {id: req.params.id}}).then(table => {
    table = JSON.parse(JSON.stringify(table));
    res.body = {table};
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

router.get('/', function(req, res, next){
  db.Table.findAll({include: [{model: db.Area}]}).then(tables => {
    tables = JSON.parse(JSON.stringify(tables));
    res.body = {tables};
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
 * @api {post} api/tables/ Create one table
 * @apiGroup Table
 * @apiName PostTable
 * @apiUse token
 * @apiParam {Object} tables
 * @apiUse tableParams
 * @apiUse tableAttributes
 *
 * @apiPermission waiter
 * @apiPermission admin
 */

router.post('/', function(req, res, next){
  db.Table.create(serialize(req.body.table)).then(table => {
    table = JSON.parse(JSON.stringify(table));
    res.body    = {table};
    res.socket  = "update";
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
 * @api {put} api/tables/:id Update one table
 * @apiGroup Table
 * @apiName UpdateTable
 * @apiUse token
 * @apiParam {Object} tables
 * @apiUse tableAttributes
 * @apiSuccess {Object} tables
 * @apiParam {Number} id
 * @apiUse tableParams
 *
 * @apiPermission waiter
 * @apiPermission admin
 */

router.put('/:id', function(req, res, next){
  db.Table.find({where: {id: req.params.id}}).then(table => {
    if(table === null) throw new Error('table not found');
    return table.update(serialize(req.body.table));
  }).then(table => {
    table = JSON.parse(JSON.stringify(table));
    res.body    = {table};
    res.socket  = "update";
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
 * @api {delete} api/tables/:id Delete one table
 * @apiGroup Table
 * @apiName DeleteTable
 * @apiParam {number} id Id
 *
 * @apiPermission waiter
 * @apiPermission admin
 * @apiSuccess {object} object empty Object {}
 */

router.delete('/:id', function(req, res){
  const io = req.app.get('io');
  db.Table.find({where: {id: req.params.id}}).then(table => {
    if(table === null) throw new Error('table not found');
    return table.destroy();
  }).then(() => {
    res.send({});
    io.sockets.emit("delete", {'type': 'table', 'id': table.id});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

module.exports = router;
