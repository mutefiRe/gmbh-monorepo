'use strict';

const express   = require('express');
const router    = express.Router();
const db        = require('../models/index');
const serialize = require('../serializers/item');

router.get('/:id', function(req, res, next){
  db.Item.find({where: {id: req.params.id}}).then(item => {
    if(item === null) throw new Error("item not found");
    else {
      item     = JSON.parse(JSON.stringify(item));
      res.body = {item};
      next();
    }
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

router.get('/', function(req, res, next){
  db.Item.findAll().then(items => {
    items    = JSON.parse(JSON.stringify(items));
    res.body = {items};
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

  db.Item.create(serialize(req.body.item)).then(item => {
    item = JSON.parse(JSON.stringify(item));
    res.body = {item};
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
  db.Item.find({where: {id: req.params.id}}).then(item => {
    if(item === null) throw new Error("item not found");
    return item.update(serialize(req.body.item));
  }).then(item => {
    item       = JSON.parse(JSON.stringify(item));
    res.body   = {item};
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
  db.Item.destroy({where: {id: req.params.id}}).then(() => {
    res.send({});
    io.sockets.emit("delete", {'type': 'item', 'id': item.id});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

module.exports = router;
