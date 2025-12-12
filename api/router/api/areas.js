'use strict';

const router = require('express').Router();
const db = require('../../models');
const requireRole = require('../permissions');

/**
 * @apiDefine areaAttributes
 * @apiSuccess {String}  areas.id Autoincremented Identifier of the table
 * @apiSuccess {String}  areas.name
 * @apiSuccess {String}  areas.short
 * @apiSuccess {Number[]}  areas.tables
 * @apiSuccess {Boolean}  areas.enabled
 */

/**
 * @apiDefine areaParams
 * @apiParam {String}  areas.id
 * @apiParam {String}  areas.name
 * @apiParam {String}  areas.short
 * @apiParam {Boolean}  areas.enabled
 */

/**
 * @api {get} api/areas/:id Request Area
 * @apiGroup Area
 * @apiName GetArea
 * @apiParam {string} id Areas unique ID.

  *@apiUse token

 * @apiSuccess {Object} areas Area
 * @apiUse areaAttributes

 * @apiPermission waiter
 * @apiPermission admin
 */

// waiter or admin
router.get('/:id', requireRole('waiter', 'admin'), function (req, res) {
  db.Area.findOne({ where: { id: req.params.id } }).then(area => {
    res.send({ area });
  });
});

/**
 * @api {get} api/areas Request all areas
 * @apiGroup Area
 * @apiName Getareas

 * @apiParam {string} x-access-token JSONWebToken | Mandatory if not set as header
 * @apiHeader {string} x-access-token JSONWebToken | Mandatory if not in params

 * @apiSuccess {Object[]} areas Area
 * @apiUse areaAttributes

 * @apiPermission waiter
 * @apiPermission admin
 */

// waiter or admin
router.get('/', requireRole('waiter', 'admin'), function (req, res) {
  db.Area.findAll({ include: [{ model: db.Table }, { model: db.User }] }).then(data => {
    const areas = JSON.parse(JSON.stringify(data));
    for (let i = 0; i < areas.length; i++) {
      areas[i].tables = areas[i].tables.map(table => table.id);
      areas[i].users = areas[i].users.map(user => user.id);
    }
    res.send({ areas });
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

/**
 * @api {post} api/areas/ Create one area
 * @apiGroup Area
 * @apiName PostArea
 * @apiUse token
 * @apiParam {Object} areas
 * @apiUse areaParams
 * @apiUse areaAttributes
 *
 * @apiPermission admin
 */

// admin only
router.post('/', requireRole('admin'), function (req, res) {
  const io = req.app.get('io');
  db.Area.create(req.body.area).then(area => {
    res.send({ area });
    io.sockets.emit("update", { area });
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

/**
 * @api {put} api/areas/:id Update one area
 * @apiGroup Area
 * @apiName UpdateArea
 * @apiUse token
 * @apiParam {Object} areas
 * @apiUse areaParams
 * @apiUse areaAttributes
 *
 * @apiPermission admin
 */

// admin only
router.put('/:id', requireRole('admin'), function (req, res) {
  const io = req.app.get('io');
  db.Area.findOne({ where: { id: req.params.id } }).then(area => {
    if (area === null) throw new Error("area not found");
    return area.update(req.body.area);
  }).then(area => {
    res.send({ area });
    io.sockets.emit("update", { area });
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

/**
 * @api {delete} api/areas/:id Delete one table
 * @apiGroup Area
 * @apiName DeleteArea
 * @apiParam {number} string Id
 *
 * @apiPermission admin
 * @apiSuccess {object} object empty Object {}
 */

// admin only
router.delete('/:id', requireRole('admin'), function (req, res) {
  const io = req.app.get('io');
  db.Area.findOne({ where: { id: req.params.id } }).then(area => {
    if (area === null) throw new Error("area not found");
    return area.destroy();
  }).then(() => {
    res.send({});
    io.sockets.emit("delete", { 'type': 'area', 'id': area.id });
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

module.exports = router;
