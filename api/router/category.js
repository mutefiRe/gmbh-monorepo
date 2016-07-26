'use strict'

const express = require('express');
const server = require('http').Server(express);
const io = require('socket.io')(server);
const router = express.Router();
const db = require('../models/index');
const serialize = require('../serializers/category');

router.use(function timeLog(req, res, next){
  //console.log('Time: ', Date.now());
  next();
})

router.get('/:id', function(req, res){
  db.Category.find({where: {id: req.params.id}}).then(data => {
    res.send({'category': data});
  })
})

router.get('/:id/items', function(req, res){
  db.Items.find({where: {CategoryId: req.params.id}}).then(data => {
    console.log(data)
    res.send({'items': data});
  })
})


router.get('/', function(req, res){
  db.Category.findAll({include: [{model: db.Item}]}).then(data =>
  {
    let categories = JSON.parse(JSON.stringify(data));
    for(var i = 0; i < categories.length; i++){
      categories[i].items = categories[i].Items.map(item => item.id);
      categories[i].Items = undefined
    }
    res.send({'category': categories});
  })
})


router.post('/', function(req, res){
  const io = req.app.get('io');
  db.Category.create(serialize(req.body.category)).then( data => {
    res.send({'category': data});
    io.sockets.emit("update", {'category': data});
  })
})

router.put('/:id', function(req, res){
  const io = req.app.get('io');
  db.Category.find({where: {id: req.params.id}}).then(category => {
    category.update(serialize(req.body.category)).then( data => {
      res.send({'category': data});
      io.sockets.emit("update", {'category': data});
    })
  })
})

router.delete('/:id', function(req, res){
  db.Category.find({where: {id: req.params.id}}).then(category=>{
    category.destroy()
  })
  res.send({});
  io.sockets.emit("update", {'category': data});
})

module.exports = router;
