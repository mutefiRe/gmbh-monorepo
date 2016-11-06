'use strict';

const express   = require('express');
const server    = require('http').Server(express);
const io        = require('socket.io')(server);
const router    = express.Router();
const db        = require('../models/index');
const serialize = require('../serializers/category');

router.get('/:id', function(req, res){
  db.Category.find({where: {id: req.params.id}}).then(data => {
    res.send({'category': data});
  }).catch(err => {
    res.status(400).send({
      'error': {
        'msg': err.errors[0].message
      }
    });
  });
});

router.get('/:id/items', function(req, res){

  db.Items.find({where: {categoryId: req.params.id}}).then(data => {
    res.send({'items': data});
  }).catch(err => {
    res.status(400).send({
      'error': {
        'msg': err.errors[0].message
      }
    });
  });
});


router.get('/', function(req, res) {
  db.Category.findAll({include: [{model: db.Item}]}).then(data =>
  {
    const categories = JSON.parse(JSON.stringify(data));
    for(let i = 0; i < categories.length; i++) {
      categories[i].items = categories[i].items.map(item => item.id);
    }
    res.send({'category': categories});
  }).catch(err => {
    res.status(400).send({
      'error': {
        'msg': err.errors[0].message
      }
    });
  });
});

router.post('/', function(req, res){
  const io = req.app.get('io');
  db.Category.create(serialize(req.body.category)).then(data => {
    res.send({'category': data});
    io.sockets.emit("update", {'category': data});
  }).catch(err => {
    res.status(400).send({
      'error': {
        'msg': err.errors[0].message
      }
    });
  });
});

router.put('/:id', function(req, res){
  const io = req.app.get('io');
  db.Category.find({where: {id: req.params.id}})
  .then(category => {
    return category.update(serialize(req.body.category));
  }).then(category => {
    res.send({category});
    io.sockets.emit("update", {category});
  }).catch(err => {
    res.status(400).send({
      'error': {
        'msg': err.errors[0].message
      }
    });
  });
});

router.delete('/:id', function(req, res){
  db.Category.find({where: {id: req.params.id}}).then(category => {
    category.destroy();
    res.send({});
    io.sockets.emit("update", {'category': data});
  }).catch(err => {
    res.status(400).send({
      'error': {
        'msg': err.errors[0].message
      }
    });
  });
});

module.exports = router;
