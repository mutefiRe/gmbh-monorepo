'use strict';

const router = require('express').Router();
const db = require('../../models');
const control = require('../../printer/control');
const print = require('../../printer/print');
const printerApi = require('../../printer/printer_api');
const logger = require('../../util/logger');

let lockSearch = false;

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

router.get('/', async function (req, res) {
  try {
    const printers = await db.Printer.findAll();
    const statuses = await Promise.all(printers.map(async (printer) => {
      try {
        const status = await printerApi.status(printer.systemName);
        return { key: printer.systemName, online: status.online };
      } catch (err) {
        return { key: printer.systemName, online: false };
      }
    }));
    const includeQueue = String(req.query.includeQueue || '').toLowerCase() === 'true';
    const queues = includeQueue ? await Promise.all(printers.map(async (printer) => {
      try {
        const queue = await printerApi.queue(printer.systemName);
        return { key: printer.systemName, queue };
      } catch (err) {
        return { key: printer.systemName, queue: null };
      }
    })) : [];
    const statusMap = new Map(statuses.map((s) => [s.key, s.online]));
    const queueMap = new Map(queues.map((q) => [q.key, q.queue]));
    const printersWithStatus = printers.map((printer) => Object.assign({}, printer.toJSON(), {
      reachable: statusMap.get(printer.systemName) || false,
      queue: includeQueue ? queueMap.get(printer.systemName) : undefined
    }));
    res.send({ printers: printersWithStatus });
  } catch (error) {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  }

});

/**
 * @api {get} api/printers/:id Request Setting
 * @apiGroup Printer
 * @apiName GetPrinter
 * @apiParam {number} string printers unique ID.

  *@apiUse token

 * @apiSuccess {Object} printers Printer
 * @apiUse printersItem

 * @apiPermission waiter
 * @apiPermission admin
 */

router.get('/:id', function (req, res) {
  db.Printer.findOne({ where: { id: req.params.id } }).then(printer => {
    if (printer === null) {
      res.status(404).send({
        'errors': {
          'msg': "couldn't find any printer"
        }
      });
      return;
    }
    res.send({ printer });
  });
});

/**
 * @api {post} api/printers/:id test print
 * @apiGroup Printer
 * @apiName TestPrinter
 * @apiParam {number} string printers unique ID.

  *@apiUse token

 * @apiSuccess {Object} empty
 * @apiPermission admin
 */

router.post('/:id/testprint', function (req, res) {
  db.Printer.findOne({ where: { id: req.params.id } }).then(printer => {
    if (printer === null) {
      res.status(404).send({
        'errors': {
          'msg': "couldn't find printer"
        }
      });
      return;
    }
    print.test(printer.dataValues);
    res.send({});
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
 * @api {post} api/printers/update Request Printers
 * @apiGroup Printer
 * @apiName UpdatePrinters

 * @apiUse token
 * @apiDescription Scans the local network for printers and adds them to the database and cups

 * @apiSuccess {String} ok
 * @apiPermission admin
 */

router.post('/update', async function (req, res) {
  const io = req.app.get('io');
  if (!lockSearch) {
    lockSearch = true;
    try {
      const _printers = await control.updatePrinters();
      const printers = _printers || [];
      logger.info(`Updated printers: ${printers.length} printers found`);
      io.sockets.emit("update", { printers: printers.slice(printers.length / 2, printers.length) });
      res.send({ status: 'ok' });
      return;
    } catch (error) {
      logger.error('Error updating printers:', error);
      res.status(400).send({
        'errors': {
          'msg': error && error.errors && error.errors[0].message || error.message
        }
      });
      return;
    } finally {
      lockSearch = false;
    }
  }
  res.status(423);
  res.send({ status: 'locked' });
});

/**
 * @api {put} api/printers/:id Updates one printer
 * @apiGroup Printer
 * @apiName UpdatePrinter
 * @apiParam {number} string Id
 *
 * @apiUse token
 * @apiUse printersItem
 *
 * @apiPermission admin
 * @apiSuccess {Object} printers Printer
 */

router.put('/:id', function (req, res) {
  const io = req.app.get('io');
  db.Printer.findOne({ where: { id: req.params.id } }).then(printer => {
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
 * @apiParam {number} string Id
 *
 * @apiPermission admin
 * @apiSuccess {object} object empty Object {}
 */

router.delete('/:id', function (req, res) {
  const io = req.app.get('io');
  db.Printer.findOne({ where: { id: req.params.id } }).then(printer => {
    if (printer === null) throw new Error('printer not found');
    return Promise.all([printer.destroy(), control.removePrinter(printer.systemName)]);
  }).then(() => {
    res.send({});
    io.sockets.emit("delete", { 'type': 'printer', 'id': req.params.id });
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

module.exports = router;
