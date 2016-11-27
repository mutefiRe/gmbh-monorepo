'use strict';

const express   = require('express');
const router    = express.Router();
const db        = require('../models/index');
const serialize = require('../serializers/category');

router.get('/:id', function(req, res, next){
  db.Category.find({where: {id: req.params.id}, include: [{model: db.Item}]}).then(category => {
    category   = JSON.parse(JSON.stringify(category));
    res.body   = {category};
    next();
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

router.get('/', function(req, res, next) {
  db.Category.findAll({include: [{model: db.Item}]}).then(categories => {
    categories = JSON.parse(JSON.stringify(categories));
    res.body   = {categories};
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
  db.Category.create(serialize(req.body.category)).then(category => {
    category   = JSON.parse(JSON.stringify(category));
    res.body   = {category};
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
  db.Category.find({where: {id: req.params.id}})
  .then(category => {
    if (category === null) throw new "category not found";
    return category.update(serialize(req.body.category));
  }).then(category => {
    category   = JSON.parse(JSON.stringify(category));
    res.body   = {category};
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
