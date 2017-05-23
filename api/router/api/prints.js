'use strict';

const express     = require('express');
const router      = express.Router();
const db          = require('../../models/index');
const print       = require('../../printer/print');
const billprinter = require('../../config/config').billprinter;

router.post('/', function(req, res){
  db.Order.findById(req.body.print.order, {
    include: [{model: db.Orderitem, include: [{model: db.Item,  include: [{model: db.Unit}, {model: db.Category}]}]},
    {model: db.Table, include: [{model: db.Area}]},
    {model: db.User}]
  }).then(data => {
    processPrint(req, data);
    res.send(responseData(req.body.print.id, data.id));
  });
});

module.exports = router;

function responseData(printId, orderId){
  return {
    print:
    {
      id:     printId,
      order : orderId
    }
  };
}

function processPrint(req, data){
  const isBill = req.body.print.isBill;
  const orders = JSON.parse(JSON.stringify(data));
  const userPrinter = data.user.dataValues.printer;

  if(isBill && userPrinter) {
    print.bill(orders, userPrinter);
  } else if(isBill) {
    db.Setting.findAll().then((settings) => {
      return JSON.parse(JSON.stringify(settings))[0].receiptPrinter;
    }).then((billPrinter) => {
      print.bill(orders, billPrinter);
    })
  } else if(userPrinter) {
    db.Setting.findAll().then((settings) => {
      return JSON.parse(JSON.stringify(settings))[0].eventName;
    }).then((eventName) => {
      print.tokenCoin(orders, userPrinter, eventName);
    })
  } else {
    print.deliveryNote(orders);
  }
}
