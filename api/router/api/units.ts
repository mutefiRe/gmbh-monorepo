'use strict';

const router = require('express').Router();
const db = require('../../models');

/**
 * @apiDefine unitAttributes
 * @apiSuccess {Number}  units.id Autoincremented Identifier of the unit
 * @apiSuccess {String}  units.name Name of the unit (e.g. "Stk.")
 */

/**
 * @apiDefine unitParams
 * @apiParam {Number}  units.id
 * @apiParam {String}  units.name
 */

/**
 * @api {get} api/units/:id Request Unit
 * @apiGroup Unit
 * @apiName GetUnit
 * @apiParam {number} string units unique ID.

  *@apiUse token

 * @apiSuccess {Object} units Unit
 * @apiUse unitAttributes

 * @apiPermission waiter
 * @apiPermission admin
 */

router.get('/:id', function (req, res) {
  db.Unit.findOne({ where: { id: req.params.id, eventId: req.eventId } }).then(unit => {
    res.send({ unit });
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

/**
 * @api {get} api/units Request all units
 * @apiGroup Unit
 * @apiName Getunits

 * @apiParam {string} x-access-token JSONWebToken | Mandatory if not set as header
 * @apiHeader {string} x-access-token JSONWebToken | Mandatory if not in params

 * @apiSuccess {Object[]} units Unit
 * @apiUse unitAttributes

 * @apiPermission waiter
 * @apiPermission admin
 */

router.get('/', function (req, res) {
  db.Unit.findAll({ where: { eventId: req.eventId } }).then(units => {
    res.send({ units });
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

/**
 * @api {post} api/units/ Create one unit
 * @apiGroup Unit
 * @apiName PostUnit
 * @apiUse token
 * @apiParam {Object} units
 * @apiUse unitParams
 * @apiUse unitAttributes
 *
 * @apiPermission admin
 */

router.post('/', function (req, res) {
  const io = req.app.get('io');
  db.Unit.create({ ...req.body.unit, eventId: req.eventId }).then(unit => {
    res.send({ unit });
    io.sockets.emit("update", { unit, eventId: req.eventId });
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

/**
 * @api {put} api/units/:id Update one unit
 * @apiGroup Unit
 * @apiName UpdateUnit
 * @apiUse token
 * @apiUse unitParams
 * @apiParam {Object} units
 * @apiUse unitAttributes
 * @apiSuccess {Object} units
 * @apiParam {number} string
 *
 * @apiPermission admin
 */

router.put('/:id', function (req, res) {
  const io = req.app.get('io');
  db.Unit.findOne({ where: { id: req.params.id, eventId: req.eventId } }).then(unit => {
    if (unit === null) throw new Error('unit not found');
    return unit.update({ ...req.body.unit, eventId: req.eventId });
  }).then(unit => {
    res.send({ unit });
    io.sockets.emit("update", { unit, eventId: req.eventId });
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

/**
 * @api {delete} api/units/:id Delete one unit
 * @apiGroup Unit
 * @apiName DeleteUnit
 * @apiParam {number} string Id
 *
 * @apiPermission admin
 * @apiSuccess {object} object empty Object {}
 */

router.delete('/:id', async function (req, res) {
  const io = req.app.get('io');
  try {
    const unit = await db.Unit.findOne({ where: { id: req.params.id, eventId: req.eventId } });
    if (unit === null) {
      throw new Error('unit not found');
    }
    const unitId = unit.id;
    await unit.destroy();
    res.send({});
    io.sockets.emit("delete", { type: 'unit', id: unitId, eventId: req.eventId });
  } catch (error) {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  }
});

module.exports = router;
