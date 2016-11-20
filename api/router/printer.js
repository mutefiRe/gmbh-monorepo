'use strict';

const express = require('express');
const router = express.Router();
const printer = require('printer/lib');

/**
 * @api {get} api/printers Request Printers
 * @apiGroup Printer
 * @apiName GetPrinters

  *@apiUse token

 * @apiSuccess {Object} printers Printer
 * @apiSuccess {String} printers.name identifier on server

 * @apiPermission waiter
 * @apiPermission admin
 */

router.get('/', function(req, res){
  const printers = printer.getPrinters();
  for (let i = 0; i < printers.length; i++){
    printers[i].id   = i + 1;
    printers[i].jobs = undefined;
  }
  res.status(200).send({"printer" : printers});
});

module.exports = router;
