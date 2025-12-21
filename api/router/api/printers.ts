import { Router, type Request, type Response } from 'express';
import db from '../../models';
const control = require('../../printer/control');
const print = require('../../printer/print');
const printerApi = require('../../printer/printer_api');
const logger = require('../../util/logger');

const router = Router();

let lockSearch = false;

router.get('/', async function (req: Request, res: Response) {
  try {
    const printers = await db.Printer.findAll();
    const statuses = await Promise.all(printers.map(async (printer: any) => {
      try {
        const status = await printerApi.status(printer.systemName);
        return { key: printer.systemName, online: status.online };
      } catch (err) {
        return { key: printer.systemName, online: false };
      }
    }));
    const includeQueue = String(req.query.includeQueue || '').toLowerCase() === 'true';
    const queues = includeQueue ? await Promise.all(printers.map(async (printer: any) => {
      try {
        const queue = await printerApi.queue(printer.systemName);
        return { key: printer.systemName, queue };
      } catch (err) {
        return { key: printer.systemName, queue: null };
      }
    })) : [];
    const statusMap = new Map(statuses.map((s) => [s.key, s.online]));
    const queueMap = new Map(queues.map((q) => [q.key, q.queue]));
    const printersWithStatus = printers.map((printer: any) => Object.assign({}, printer.toJSON(), {
      reachable: statusMap.get(printer.systemName) || false,
      queue: includeQueue ? queueMap.get(printer.systemName) : undefined
    }));
    res.send({ printers: printersWithStatus });
  } catch (error: any) {
    res.status(400).send({
      errors: {
        msg: error?.errors?.[0]?.message || error?.message
      }
    });
  }
});

router.get('/:id', async function (req: Request, res: Response) {
  try {
    const printer = await db.Printer.findOne({ where: { id: req.params.id } });
    if (printer === null) {
      res.status(404).send({
        errors: {
          msg: "couldn't find any printer"
        }
      });
      return;
    }
    res.send({ printer });
  } catch (error: any) {
    res.status(400).send({
      errors: {
        msg: error?.errors?.[0]?.message || error?.message
      }
    });
  }
});

router.post('/:id/testprint', async function (req: Request, res: Response) {
  try {
    const printer = await db.Printer.findOne({ where: { id: req.params.id } });
    if (printer === null) {
      res.status(404).send({
        errors: {
          msg: "couldn't find printer"
        }
      });
      return;
    }
    print.test(printer.dataValues);
    res.send({});
  } catch (error: any) {
    res.status(400).send({
      errors: {
        msg: error?.errors?.[0]?.message || error?.message
      }
    });
  }
});

router.post('/update', async function (req: Request, res: Response) {
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
    } catch (error: any) {
      logger.error('Error updating printers:', error);
      res.status(400).send({
        errors: {
          msg: error?.errors?.[0]?.message || error?.message
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

router.put('/:id', async function (req: Request, res: Response) {
  const io = req.app.get('io');
  try {
    const printer = await db.Printer.findOne({ where: { id: req.params.id } });
    if (printer === null) {
      throw new Error('printer not found');
    }
    const updated = await printer.update(req.body.printer);
    res.send({ printer: updated });
    io.sockets.emit("update", { printer: updated });
  } catch (error: any) {
    res.status(400).send({
      errors: {
        msg: error?.errors?.[0]?.message || error?.message
      }
    });
  }
});

router.delete('/:id', async function (req: Request, res: Response) {
  const io = req.app.get('io');
  try {
    const printer = await db.Printer.findOne({ where: { id: req.params.id } });
    if (printer === null) {
      throw new Error('printer not found');
    }
    await Promise.all([printer.destroy(), control.removePrinter(printer.systemName)]);
    res.send({});
    io.sockets.emit("delete", { type: 'printer', id: req.params.id });
  } catch (error: any) {
    res.status(400).send({
      errors: {
        msg: error?.errors?.[0]?.message || error?.message
      }
    });
  }
});

export default router;
