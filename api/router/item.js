'use strict';

const express   = require('express');
const router    = express.Router();
const db        = require('../models/index');
const serialize = require('../serializers/item');

router.get('/:id', function(req, res){
  db.Item.find({where: {id: req.params.id}}).then(data => {
    if(data === null){
      res.status(404).send("couldn't find item");
      return;
    }
    res.send({'item':data});
  }).catch(err => {
    res.status(400).send({
      'error': {
        'msg': err.errors[0].message
      }
    });
  });
});

router.get('/', function(req, res){
  db.Item.findAll({include: [{model: db.Unit}]}).then(data =>
  {
    const items = JSON.parse(JSON.stringify(data));
    for(let i = 0; i < items.length; i++){
      items[i].unit = items[i].unitId;
      items[i].category = items[i].cateteogryId;
    }
    res.send({'item': items});
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
  db.Item.create(serialize(req.body.item)).then( data => {
    res.send({'item':data});
    io.sockets.emit("update", {'item':data});
    return db.Category.find({where: {id: data.categoryId}, include: [{model: db.Item}]}).then(catData =>
    {
      const categories = JSON.parse(JSON.stringify(catData));
      categories.items = categories.items.map(item => item.id);
      io.sockets.emit("update", {'category': categories});
    });
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
  db.Item.find({where: {id: req.params.id}}).then(item => {
    if(item === null){
      throw new Error({message: "not found"})
    }
    return item.update(serialize(req.body.item));
  }).then(item => {
    res.send({item});
    io.sockets.emit("update", {item});
  }).catch(err => {
    console.log(err.toString())
    res.status(400).send({
      'error': {
        'msg': err.errors[0].message
      }
    });
  });
});

router.delete('/:id', function(req, res){
  db.Item.destroy({where: {id: req.params.id}}).then(() => {
    res.send({});
  }).catch(err => {
    res.status(400).send({
      'error': {
        'msg': err.errors[0].message
      }
    });
  });
});

module.exports = router;
