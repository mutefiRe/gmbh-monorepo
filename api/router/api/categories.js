'use strict';

const router = require('express').Router();
const db     = require('../../models');

router.get('/:id', function(req, res){
  db.Category.find({where: {id: req.params.id}}).then(category => {
    res.send({category});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

router.get('/', function(req, res) {
  db.Category.findAll().then(categories => {
    res.send({categories});
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
  db.Category.create(req.body.category).then(category => {
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

router.put('/:id', function(req, res){
  const io = req.app.get('io');
  db.Category.find({where: {id: req.params.id}})
  .then(category => {
    if (category === null) throw new "category not found";
    return category.update(req.body.category);
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
