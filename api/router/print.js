'use strict'

const express = require('express');
const router = express.Router();
const db = require('../models/index');
const serialize = require('../serializers/order');
const print = require('../print.js');

router.use(function timeLog(req, res, next){
  //console.log('Time: ', Date.now());
  next();
})


router.post('/', function(req, res){
  db.Order.findById(req.body.print.order, {include: [{model: db.Orderitem, include: [{model: db.Item, include: [{model: db.Unit}, {model: db.Category}]}]}, {model: db.Table, include: [{model: db.Area}]}, {model: db.User}]}).then(data =>
  {
    let orders = JSON.parse(JSON.stringify(data));
    print.deliveryNote(orders);
    res.send({'print': { "order" : data.id }});
  })
})

module.exports = router;
