'use strict';

const router    = require('express').Router();
const db        = require('../../models');
const serialize = require('../../serializers/area');

/**
 * @apiDefine areaAttributes
 * @apiSuccess {Number}  areas.id Autoincremented Identifier of the table
 * @apiSuccess {String}  areas.name
 * @apiSuccess {Number[]}  areas.tables
 */

/**
 * @apiDefine areaParams
 * @apiParam {Number}  areas.id
 * @apiParam {String}  areas.name
 */

/**
 * @api {get} api/areas/:id Request Area
 * @apiGroup Area
 * @apiName GetArea
 * @apiParam {Number} id Areas unique ID.

  *@apiUse token

 * @apiSuccess {Object} areas Area
 * @apiUse areaAttributes

 * @apiPermission waiter
 * @apiPermission admin
 */

router.get('/:id', function(req, res){
  db.Area.find({where: {id: req.params.id}}).then(data => {
    res.send({'area': data});
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

router.get('/', function(req, res){
  db.Area.findAll({include: [{model: db.Table}, {model: db.User}]}).then(data => {
    const areas = JSON.parse(JSON.stringify(data));
    for(let i = 0; i < areas.length; i++){
      areas[i].tables = areas[i].tables.map(table => table.id);
      areas[i].users  = areas[i].users.map( user  => user.id);
    }
    res.send({areas});
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
 * @apiPermission waiter
 * @apiPermission admin
 */

router.post('/', function(req, res){
  const io = req.app.get('io');
  db.Area.create(serialize(req.body.area)).then(area => {
    res.send({area});
    io.sockets.emit("update", {area});
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
 * @apiPermission waiter
 * @apiPermission admin
 */

router.put('/:id', function(req, res){
  const io = req.app.get('io');
  db.Area.find({where: {id: req.params.id}}).then(area => {
    if (area === null) throw new Error("area not found");
    return area.update(serialize(req.body.area));
  }).then(area => {
    res.send({area});
    io.sockets.emit("update", {area});
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
 * @apiParam {number} id Id
 *
 * @apiPermission waiter
 * @apiPermission admin
 * @apiSuccess {object} object empty Object {}
 */

router.delete('/:id', function(req, res){
  const io = req.app.get('io');
  db.Area.find({where: {id: req.params.id}}).then(area => {
    if (area === null) throw new Error("area not found");
    return area.destroy();
  }).then(() => {
    res.send({});
    io.sockets.emit("delete", {'type': 'area', 'id': area.id});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

module.exports = router;
