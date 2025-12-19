const db = require('../models');
const logger = require('../util/logger');
const printerApi = require('./printer_api');

module.exports = {
  addPrinter() {
    return Promise.resolve();
  },
  removePrinter() {
    return Promise.resolve();
  },
  async updatePrinters() {
    const result = await printerApi.discover();
    const printers = result.printers || [];
    const stored = [];

    for (const printer of printers) {
      const systemName = printer.id;
      const name = buildPrinterName(printer);
      try {
        const [record, created] = await db.Printer.findOrCreate({
          where: { systemName },
          defaults: { name }
        });
        if (!created && record.name !== name) {
          await record.update({ name });
        }
        stored.push(record);
      } catch (e) {
        logger.error(`Failed to create or find printer ${systemName} in DB: ${e.message}`);
      }
    }
    return stored;
  }
}

function buildPrinterName(printer) {
  if (printer.labels && printer.labels.mac) {
    return `Printer ${printer.labels.mac}`;
  }
  if (printer.labels && printer.labels.ip) {
    return `Printer ${printer.labels.ip}`;
  }
  if (printer.usb && printer.usb.product) {
    return `Printer ${printer.usb.product}`;
  }
  return `Printer ${printer.id}`;
}
