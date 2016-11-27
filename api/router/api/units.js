'use strict';

const router    = require('express').Router();
const db        = require('../../models');
const serialize = require('../../serializers/unit');

router.get('/:id', function(req, res, next){
  db.Unit.find({where: {id: req.params.id}}).then(unit => {
    unit = JSON.parse(JSON.stringify(unit));
    res.body = {unit};
    next();
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

router.get('/', function(req, res, next){
  db.Unit.findAll().then(units => {
    units = JSON.parse(JSON.stringify(units));
    res.body = {units};
    next();
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

router.post('/', function(req, res, next) {
  db.Unit.create(serialize(req.body.unit)).then(unit => {
    unit = JSON.parse(JSON.stringify(unit));
    res.body = {unit};
    res.socket = "update";
    next();
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

router.put('/:id', function(req, res, next){
  db.Unit.find({where: {id: req.params.id}}).then(unit => {
    if (unit === null) throw new Error('unit not found');
    return unit.update(serialize(req.body.unit));
  }).then(unit => {
    unit = JSON.parse(JSON.stringify(unit));
    res.body = {unit};
    res.socket = "update";
    next();
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
