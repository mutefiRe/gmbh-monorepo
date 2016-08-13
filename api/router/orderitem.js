'use strict'

const express = require('express');
const router = express.Router();
const db = require('../models/index');
const serialize = require('../serializers/orderitem');


router.get('/:id', function(req, res){
  db.Orderitem.find({where: {id: req.params.id}}).then(data => {
    if(data === null){
      res.status(404).send("couldn't find item")
      return
    }
    res.send({'item':data});
  })
})

router.get('/', function(req, res){
  db.Orderitem.findAll({include: [{model: db.Item}, {model: db.Order, where: {userId: req.decoded.id}}]}).then(data =>
  {
    let orderitems = JSON.parse(JSON.stringify(data));
    for(var i = 0; i < orderitems.length; i++){
      orderitems[i].item = orderitems[i].Item.id
      orderitems[i].Item = undefined
    }
    res.send({'orderitem': orderitems});
  })
})



router.post('/', function(req, res){
  const io = req.app.get('io');
  db.Orderitem.create(serialize(req.body.orderitem)).then( orderitem => {
    let item = JSON.parse(JSON.stringify(orderitem));
    item.item = item.ItemId;
    item.order = item.OrderId;
    delete(item.ItemId);
    delete(item.OrderId);
    res.send({'orderitem': item});
 //   io.sockets.emit('update', {'orderitem': item});
  }).catch(err => {
    res.status(400).send(err)
  })
})

router.put('/:id', function(req, res){
  const io = req.app.get('io');
  db.Orderitem.update(serialize(req.body.orderitem),{where: {id: req.params.id}})
  .then( data => {
    return db.Orderitem.findById(req.params.id);
  }).then((orderitem) => {
    let item = JSON.parse(JSON.stringify(orderitem));
    item.item = item.ItemId;
    item.order = item.OrderId;
    delete(item.ItemId);
    delete(item.OrderId);
    res.send({'orderitem': item});
 //   io.sockets.emit('update', {'orderitem': item});
  }).catch(err => {
    res.status(400).send(err)
  })
})

router.delete('/:id', function(req, res){
  db.Orderitem.find({where: {id: req.params.id}}).then(item=>{
    if(item === null){
      res.status(404).send("couldn't find item which should be deleted")
      return
    }
    item.destroy().then(()=>{
      res.send({})
    })
  })
})


module.exports = router;
