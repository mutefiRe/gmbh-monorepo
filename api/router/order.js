'use strict'

const express = require('express');
const router = express.Router();
const db = require('../models/index');
const serialize = require('../serializers/order');

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
  db.Order.create(serialize(req.body.order)).then( data => {
    res.send({'order': data});
  })
})

router.put('/:id', function(req, res){
  db.Order.find({where: {id: req.params.id}}).then(order => {
    order.update(req.body).then( data => {
     res.send({'order': data});
   })
  })
})

router.delete('/:id', function(req, res){
  db.Order.find({where: {id: req.params.id}}).then(order=>{
    order.destroy()
  })
  res.send({'order': data});
})

module.exports = router;
