'use strict'

const express = require('express');
const server = require('http').Server(express);
const io = require('socket.io')(server);
const router = express.Router();
const db = require('../models/index');
const serialize = require('../serializers/order');
const print = require('../print.js');


router.use(function timeLog(req, res, next){
  //console.log('Time: ', Date.now());
  next();
})

router.get('/:id', function(req, res){
  db.Order.find({where: {id: req.params.id}}).then(data => {
    res.send({'order': data});
  })
})


router.get('/', function(req, res){
  db.Order.findAll({include: [{model: db.Orderitem},{model: db.Table}]}).then(data =>
  {
    let orders = JSON.parse(JSON.stringify(data));
    for(let i = 0; i < orders.length; i++){
      orders[i].orderitems = orders[i].Orderitems.map(orderitem => orderitem.id);
      orders[i].Orderitems = undefined;
      orders[i].table = orders[i].Table.id;
      orders[i].Table = undefined;
    }
    res.send({'order': orders});
  })
})


router.post('/', function(req, res){
  const io = req.app.get('io');
  db.Order.create(serialize(req.body.order)).then( data => {
    let order = JSON.parse(JSON.stringify(data));
    order.table = order.TableId;
    order.user = order.UserId;
    delete(order.TableId);
    delete(order.UserId);
    res.send({'order': order});
    io.sockets.emit("update", {'order': order});
    console.log("O POST");
  })
})

router.put('/:id', function(req, res){
  const io = req.app.get('io');
  db.Order.findById(req.params.id, {include: [{model: db.Orderitem, include: [{model: db.Item}]}]}).then(order => {
    order.update(serialize(req.body.order)).then( data => {

      res.send({'order': data});
      io.sockets.emit("update", {'order': data});
      console.log("O PUT");
    })
  })
})

router.delete('/:id', function(req, res){
  db.Order.find({where: {id: req.params.id}}).then(order=>{
    order.destroy()
  })
  res.send({});
})

module.exports = router;
