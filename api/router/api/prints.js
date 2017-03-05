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
    res.send(responseData(data.id));
  });
});

module.exports = router;

function responseData(id){
  return {
    'print':
    {
      id,
      'order' : id
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
    print.bill(orders, billprinter);
  } else if(userPrinter) {
    print.tokenCoin(orders, userPrinter);
  } else {
    print.deliveryNote(orders);
  }
}