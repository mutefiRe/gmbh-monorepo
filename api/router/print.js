'use strict'

const express = require('express');
const router = express.Router();
const db = require('../models/index');
const print = require('../print.js');
const billprinter = require('../config/config').billprinter;

router.use(function timeLog(req, res, next){
  //console.log('Time: ', Date.now());
  next();
})


router.post('/', function(req, res){
  db.Order.findById(req.body.print.order, {include: [{model: db.Orderitem, include: [{model: db.Item, include: [{model: db.Unit}, {model: db.Category}]}]}, {model: db.Table, include: [{model: db.Area}]}, {model: db.User}]}).then(data =>
  {
    const isBill = req.body.print.isBill;
    const orders = JSON.parse(JSON.stringify(data));
    const userPrinter = data.user.dataValues.printer;

    if(isBill && userPrinter) {
      console.log('Print bill from User assigned Printer')
      print.bill(orders, userPrinter);
    } else if(isBill) {
      console.log('Print bill for configured Printer')
      print.bill(orders, billprinter);
    } else if(userPrinter) {
      console.log('Print delivery Note from User assigned Printer')
      print.tokenCoin(orders, userPrinter);
    } else {
      console.log('Print delivery Note')
      print.deliveryNote(orders);
    }

    res.send({'print': { "order" : data.id }});
  })
})

module.exports = router;
