'use strict';

const express   = require('express');
const router    = express.Router();
const db        = require('../models/index');
const serialize = require('../serializers/area');

router.get('/:id', function(req, res){
  db.Area.find({where: {id: req.params.id}}).then(data => {
    res.send({'area': data});
  });
});

router.get('/', function(req, res){
  db.Area.findAll({include: [{model: db.Table}, {model: db.User}]}).then(data => {
    const areas = JSON.parse(JSON.stringify(data));
    for(let i = 0; i < areas.length; i++){
      areas[i].tables = areas[i].tables.map(table => table.id);
      areas[i].users  = areas[i].users.map( user  => user.id);
    }
    res.send({'area': areas});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

router.post('/', function(req, res){
  const io = req.app.get('io');
  db.Area.create(serialize(req.body.area)).then(data => {
    res.send({'area': data});
    io.sockets.emit("update", {'area': data});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

router.put('/:id', function(req, res){
  const io = req.app.get('io');
  db.Area.find({where: {id: req.params.id}}).then(area => {
    if (area === null) throw new Error("area not found");
    return area.update(serialize(req.body.area));
  }).then(data => {
    res.send({'area': data});
    io.sockets.emit("update", {'area': data});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

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
