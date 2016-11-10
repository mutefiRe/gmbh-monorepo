'use strict';

const express = require('express');
const router = express.Router();
const db = require('../models/index');
const serialize = require('../serializers/unit');

router.get('/:id', function(req, res){
  db.Unit.find({where: {id: req.params.id}}).then(data => {
    res.send({'unit': data});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

router.get('/', function(req, res){
  db.Unit.findAll().then(units => {
    res.send({units});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

router.post('/', function(req, res) {
  const io = req.app.get('io');
  db.Unit.create(serialize(req.body.unit)).then(unit => {
    res.send({unit});
    io.sockets.emit("update", {unit});
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
  db.Unit.find({where: {id: req.params.id}}).then(unit => {
    if (unit === null) throw new Error('unit not found');
    return unit.update(serialize(req.body.unit));
  }).then(unit => {
    res.send({unit});
    io.sockets.emit("update", {unit});
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
  db.Unit.find({where: {id: req.params.id}}).then(unit => {
    if (unit === null) throw new Error('unit not found');
    return unit.destroy();
  }).then(() => {
    res.send({});
    io.sockets.emit("delete", {'type': 'unit', 'id': unit.id});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

module.exports = router;
