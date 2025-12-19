'use strict';

const express = require('express');
const router = express.Router();
const db = require('../../models/index');
const print = require('../../printer/print');

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

router.post('/', async function (req, res) {
  const print = req.body.print;
  if (!print || !print.orderId) {
    res.status(400).send({
      'errors': {
        'msg': 'print.id and print.orderId are required'
      }
    });
    return;
  }
  try {
    const data = await db.Order.findOne({
      where: { id: print.orderId },
      include: [
        {
          model: db.Orderitem,
          include: [
            {
              model: db.Item,
              include: [
                { model: db.Unit },
                {
                  model: db.Category,
                  include: [
                    { model: db.Printer, as: 'printer' }
                  ]
                }
              ]
            }
          ]
        },
        { model: db.Table, include: [{ model: db.Area }] },
        { model: db.User, include: [{ model: db.Printer, as: 'printer' }] }
      ]
    });
    await processPrint(req, data);
    res.send(responseData(print.id, data.id));
  } catch (error) {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  }
});

module.exports = router;

function responseData(printId, orderId) {
  return {
    print: {
      printId: printId,
      orderId: orderId
    }
  }
};

async function processPrint(req, data) {
  const isBill = req.body.print.isBill;
  const orders = JSON.parse(JSON.stringify(data));
  const userPrinter = (data.user.dataValues.printer || {}).systemName;
  if (isBill && userPrinter) {
    await print.bill(orders, userPrinter);
  } else if (isBill) {
    const settings = await db.Setting.findAll({ include: [{ model: db.Printer, as: 'receiptPrinter' }] });
    const billPrinter = JSON.parse(JSON.stringify(settings))[0].receiptPrinter.systemName;
    await print.bill(orders, billPrinter);
  } else if (userPrinter) {
    const settings = await db.Setting.findAll();
    const eventName = JSON.parse(JSON.stringify(settings))[0].eventName;
    await print.tokenCoin(orders, userPrinter, eventName);
  } else {
    await print.deliveryNote(orders);
  }
}
