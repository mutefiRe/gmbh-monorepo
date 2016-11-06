'use strict';

const express   = require('express');
const server    = require('http').Server(express);
const router    = express.Router();
const db        = require('../models/index');
const serialize = require('../serializers/category');

router.get('/:id', function(req, res){
  db.Category.find({where: {id: req.params.id}}).then(data => {
    res.send({'category': data});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error.message
      }
    });
  });
});

router.get('/:id/items', function(req, res){
  db.Items.find({where: {categoryId: req.params.id}}).then(data => {
    res.send({'items': data});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

router.get('/', function(req, res) {
  db.Category.findAll({include: [{model: db.Item}]}).then(data => {
    const categories = JSON.parse(JSON.stringify(data));
    for(let i = 0; i < categories.length; i++) {
      categories[i].items = categories[i].items.map(item => item.id);
    }
    res.send({'category': categories});
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
  db.Category.create(serialize(req.body.category)).then(data => {
    res.send({'category': data});
    io.sockets.emit("update", {'category': data});
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
  db.Category.find({where: {id: req.params.id}})
  .then(category => {
    if (category === null) throw new "category not found";
    return category.update(serialize(req.body.category));
  }).then(category => {
    res.send({category});
    io.sockets.emit("update", {category});
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
  db.Category.find({where: {id: req.params.id}}).then(category => {
    if (category === null) throw new "category not found";
    return category.destroy();
  }).then(category => {
    res.send({});
    io.sockets.emit("delete", {'type': 'category', 'id': category.id});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

module.exports = router;
