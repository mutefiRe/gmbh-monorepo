'use strict';

const layout = require('./layout');
const printerApi = require('./printer_api');
const logger = require('../util/logger');

class Print {
  deliveryNote(order, fallbackPrinter) {
    const printers = new Map();
    order.orderitems.forEach((orderitem) => {
      const printer = (orderitem.item.category.printer || {}).systemName;
      const printerName = printer || fallbackPrinter;
      if (!printerName) return;
      console.log(`printer: ${JSON.stringify(orderitem.item.category)}`)
      if (printers.has(printerName)) {
        printers.get(printerName).push(orderitem);
      } else {
        printers.set(printerName, [orderitem]);
      }
    });

    const jobs = [];
    const entries = Array.from(printers.entries());
    const totalParts = entries.length;
    entries.forEach(([printer, orderitems], index) => {
      const orderPrinter = { ...order, orderitems, printPart: index + 1, printTotal: totalParts };
      jobs.push(this.printJob(printer, layout.deliveryNote(orderPrinter)));
    });
    return Promise.all(jobs);
  }

  tokenCoin(data, printer, eventName) {
    const tokens = data.orderitems.map((order) => layout.tokenCoin(order, eventName));
    let printSequence = [];
    tokens.forEach((token) => {
      printSequence = printSequence.concat(token);
    })
    return this.printJob(printer, printSequence);
  }

  bill(order, printer) {
    throw new Error('bill printing is disabled');
  }

  test(printer) {
    return this.printJob(printer.systemName, layout.printerTest(printer));
  }

  printJob(printerName, data) {
    const payload = this._toBuffer(data);
    logger.info({ printerId: printerName }, 'received print job');
    return printerApi.printRaw(printerName, payload)
      .then((result) => {
        logger.info({ printerId: printerName, bytesSent: result.bytesSent }, 'print sent');
      })
      .catch((err) => {
        logger.error({ printerId: printerName, err: err && err.message }, 'print failed');
      });
  }

  _toBuffer(data) {
    return Buffer.from(
      data
        .map(this._stringCharArray)
        .reduce((a, b) => a.concat(b), [])
    );
  }

  _stringCharArray(value) {
    if (typeof value === 'string') {
      return value.split('').map((str) => str.charCodeAt(0));
    }
    return value;
  }
}

module.exports = new Print();
