'use strict';

const express   = require('express');
const router    = express.Router();
const db        = require('../../models');

router.get('/:id', function(req, res){
  db.Table.find({where: {id: req.params.id}}).then(table => {
    res.send({table});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

router.get('/', function(req, res){
  db.Table.findAll().then(tables => {
    res.send({tables});
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
  db.Table.create(req.body.table).then(table => {
    io.sockets.emit("update", {table});
    res.send({table});
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
  db.Table.find({where: {id: req.params.id}}).then(table => {
    if(table === null) throw new Error('table not found');
    return table.update(req.body.table);
  }).then(table => {
    res.send({table});
    io.sockets.emit("update", {table});
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
