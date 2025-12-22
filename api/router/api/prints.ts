'use strict';

const express = require('express');
const router = express.Router();
const db = require('../../models/index');
const printerService = require('../../printer/print');

router.post('/', async function (req, res) {
  const printRequest = req.body.print;
  if (!printRequest || !printRequest.orderId) {
    res.status(400).send({
      'errors': {
        'msg': 'print.id and print.orderId are required'
      }
    });
    return;
  }
  try {
    const data = await db.Order.findOne({
      where: { id: printRequest.orderId, eventId: req.eventId },
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
        { model: db.User }
      ]
    });
    await processPrint(req, data);
    await data.increment('printCount', { by: 1 });
    res.send(responseData(printRequest.id, data.id));
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
  if (isBill) {
    throw new Error('bill printing is disabled');
  }
  const fallbackPrinter = await db.Printer.findOne({ order: [['createdAt', 'ASC']] });
  await printerService.deliveryNote(orders, fallbackPrinter?.systemName || null);
}
