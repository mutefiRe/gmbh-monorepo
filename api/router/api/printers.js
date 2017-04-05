'use strict';

const router = require('express').Router();
const db = require('../../models');
const control = require('../../printer/control');

/**
 * @apiDefine printersItem
 * @apiSuccess {String}  printers.id Universal unique Identifier of the printer
 * @apiSuccess {String}  printers.systemName name of the printer in the system. Usually the mac adress
 * @apiSuccess {String}  printers.name user selected name for printer
 */

/**
 * @api {get} api/printers Request Printers
 * @apiGroup Printer
 * @apiName GetPrinters

 * @apiUse token
 * @apiUse printersItem

 * @apiSuccess {Object} printers Printer

 * @apiPermission waiter
 * @apiPermission admin
 */

router.get('/', function (req, res) {
  db.Printer.findAll().then(printers => {
    res.send({ printers });
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

/**
 * @api {get} api/printers/update Request Printers
 * @apiGroup Printer
 * @apiName UpdatePrinters

 * @apiUse token
 * @apiDescription Scans the local network for printers and adds them to the database and cups

 * @apiSuccess (200)
 * @apiPermission waiter
 * @apiPermission admin
 */

router.get('/update', function (req, res) {
  control.updatePrinters()
    .then(() => {
      res.status(200);
    })
    .catch((error) => {
      res.status(400).send({
        'errors': {
          'msg': error && error.errors && error.errors[0].message || error.message
        }
      });
    })
});

/**
 * @api {put} api/printers/:id Updates one printer
 * @apiGroup Printer
 * @apiName UpdatePrinter
 * @apiParam {number} id Id
 *
 * @apiUse token
 * @apiUse printersItem
 *
 * @apiPermission waiter
 * @apiPermission admin
 * @apiSuccess {Object} printers Printer
 */

router.put('/:id', function (req, res) {
  const io = req.app.get('io');
  db.Printer.find({ where: { id: req.params.id } }).then(printer => {
    if (printer === null) throw new Error("printer not found");
    return printer.update(req.body.printer);
  }).then(printer => {
    res.send({ printer });
    io.sockets.emit("update", { printer });
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});


/**
 * @api {delete} api/printers/:id Delete one printer
 * @apiGroup Printer
 * @apiName DeletePrinter
 * @apiParam {number} id Id
 *
 * @apiPermission waiter
 * @apiPermission admin
 * @apiSuccess {object} object empty Object {}
 */

router.delete('/:id', function(req, res) {
  const io = req.app.get('io');
  db.Printer.find({where: {id: req.params .id}}).then(printer => {
    if (printer === null) throw new Error('printer not found');
    return Promise.all([printer.destroy(), control.removePrinter(printer.systemName)]);
  }).then(() => {
    res.send({});
    io.sockets.emit("delete", {'type': 'printer', 'id': req.params.id});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

module.exports = router;
