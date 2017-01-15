'use strict';

const router    = require('express').Router();
const db        = require('../../models');

router.get('/:id', function(req, res, next){
  db.Item.find({where: {id: req.params.id}}).then(item => {
    if(item === null) throw new Error("item not found");
    else {
      res.send({item});
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
    res.send({items});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

router.post('/', function(req, res){
  db.Item.create(req.body.item).then(item => {
    res.send({item});
    io.sockets.emit("update", {item});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

router.put('/:id', function(req, res){
  db.Item.find({where: {id: req.params.id}}).then(item => {
    if(item === null) throw new Error("item not found");
    return item.update(req.body.item);
  }).then(item => {
    res.send({item});
    io.sockets.emit("update", {item});
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
