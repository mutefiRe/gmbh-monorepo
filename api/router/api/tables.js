'use strict';

const express   = require('express');
const router    = express.Router();
const db        = require('../../models');
const serialize = require('../../serializers/table');

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
