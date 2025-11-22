'use strict';

const express     = require('express');
const router      = express.Router();
const db          = require('../../models/index');
const print       = require('../../printer/print');

/**
 * @apiDefine printsParams
 * @apiParam {String}  print.id
 * @apiParam {String}  print.order
 * @apiParam {Boolean} print.isBill
 */

/**
 * @api {post} api/prints start print job
 * @apiGroup Prints
 * @apiName StartPrint

 * @apiParam {string} x-access-token JSONWebToken | Mandatory if not set as header
 * @apiHeader {string} x-access-token JSONWebToken | Mandatory if not in params

 * @apiUse printsParams

 * @apiSuccess {Object} containing order.id and print.id

 * @apiPermission waiter
 * @apiPermission admin
 */

router.post('/', function(req, res){
  db.Order.findById(req.body.print.order, {
    include: [{model: db.Orderitem, include: [{model: db.Item,  include: [{model: db.Unit}, {model: db.Category, include: [{model: db.Printer}]}]}]},
    {model: db.Table, include: [{model: db.Area}]},
    {model: db.User, include: [{model: db.Printer}]}]
  }).then(data => {
    processPrint(req, data);
    res.send(responseData(req.body.print.id, data.id));
  })
  .catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
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
  const userPrinter = (data.user.dataValues.printer || {}).systemName;
  if(isBill && userPrinter) {
    print.bill(orders, userPrinter);
  } else if(isBill) {
    db.Setting.findAll({include: [{model: db.Printer, as: 'receiptPrinter'}]}).then((settings) => {
      return JSON.parse(JSON.stringify(settings))[0].receiptPrinter.systemName;
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
