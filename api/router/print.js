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


router.post('/:id', function(req, res){
  db.Order.findById(req.params.id, {include: [{model: db.Orderitem},{model: db.Table}]}).then(data =>
  {
    let orders = JSON.parse(JSON.stringify(data));
    console.log(orders)
    res.send({'success': false});
  })
})


router.post('/', function(req, res){
  db.Order.create(serialize(req.body.order)).then( data => {
    res.send({'order': data});
  })
})

module.exports = router;
