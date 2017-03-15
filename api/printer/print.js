'use strict';

const printer = require('printer/lib');
const layout = require('./layout');

class Print {
  deliveryNote(order) {
    const printers = new Map();
    order.orderitems.forEach((orderitem) => {
      const printer = orderitem.item.category.printer;
      if(printers.has(printer)) {
        printers.get(printer).push(orderitem);
      } else {
        printers.set(printer, [orderitem]);
      }
    });

    printers.forEach((orderitems, printer) => {
      const orderPrinter = order;
      orderPrinter.orderitems = orderitems;
      this.printJob(printer, layout.deliveryNote(orderPrinter));
    })
  }

  tokenCoin(data, printer, eventName) {
    const tokens = data.orderitems.map((order) => layout.tokenCoin(order, eventName));
    let printSequence = [];
    tokens.forEach((token) => {
      printSequence = printSequence.concat(token);
    })
    this.printJob(printer, printSequence);
  }

  bill(order, printer){
    this.printJob(printer, layout.bill(order));
  }

  printJob(printerName, data) {
    const self = this;
    console.log(`recieved print job for printer ${printerName}`);
    printer.printDirect({
      data: self._toBuffer(data),
      printer: printerName,
      type: 'RAW',
      success(jobID){
        console.log('sent to printer with ID: ' + jobID);
      },
      error(err){
        const StringDecoder = require('string_decoder').StringDecoder;
        const decoder = new StringDecoder('utf8');
        console.log('Printer not working', err);
        console.log(decoder.write(self._toBuffer(data)));
      }
    });
  }

  _toBuffer(data) {
    return Buffer.from(
      data
        .map(this._stringCharArray)
        .reduce((a,b) => a.concat(b), [])
    );
  }

  _stringCharArray(value) {
    if(typeof value === 'string') {
      return value.split('').map((str) => str.charCodeAt(0));
    }
    return value;
  }
}

module.exports = new Print();
