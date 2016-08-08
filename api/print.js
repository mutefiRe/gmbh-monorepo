'use strict';

const fs = require('fs');
const db = require('./models/index');
const printer = require('printer/lib');

String.prototype.toBytes = function() {
  const arr = []
  for (var i=0; i < this.length; i++) {
    arr.push(this[i].charCodeAt(0))
  }
  return arr;
}

const PAPER_FULL_CUT = [ 0x1d, 0x56, 0x00 ];
const PAPER_PART_CUT = [ 0x1d, 0x56, 0x01 ];

const CHAR_CODE = [27, 116, 6]; // West Europe

const EUR = [27, 116, 19, 213].concat(CHAR_CODE);

const CENTER = [0x1b, 0x61, 0x1];
const LEFT = [0x1b, 0x61, 0x0];
const RIGHT = [0x1b, 0x61, 0x2];
const FEED = '\n\n\n\n\n\n\n'.toBytes();
const ENTER = '\n'.toBytes();

const TXT_2HEIGHT =  [ 0x1b, 0x21, 0x10 ];
const TXT_NORMAL =  [ 0x1b, 0x21, 0x00 ];

const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf8');



class Print {
  constructor(length) {
    this.length = length;
  }

  deliveryNote(data) {
    const printers = {}
    for (let key in data.Orderitems) {
      const ord = data.Orderitems[key];
      const printer = ord.Item.Category.printer;
      if (!printers[printer]) {
        printers[printer] = {}
      }
      printers[printer][key] = ord
    }

    const order = data;

    for(let printer in printers) {
      order.Orderitems = printers[printer];
      this.singleDeliveryNote(printer, order)
    }
  }

  deliveryNote(data, bool) {
    if(bool !== true) {
      this.deliveryNote(data);deliveryNote
    }

    for(let order in data.Orderitems) {
      this.token_coin('GMBH_COUPON', data.Orderitems[order]);
    }
  }

  singleDeliveryNote(printer, data) {
    const order = this.transformOrder(data);
    const printData = [];
    printData.push(CHAR_CODE);

    printData.push(leftPadding(`${order.Table.name}/${order.Table.Area.name}`,48), ENTER);
    printData.push(TXT_2HEIGHT, 'Bestellung', TXT_NORMAL, ENTER);
    printData.push(rightPadding(`Nr. ${order.id}`, 24), leftPadding(formatDate(order.createdAt), 24), ENTER);

    printData.push(ENTER);
    printData.push(deliveryNoteHeader(), ENTER);

    for (const item in order.Orderitems) {
      const ord = order.Orderitems[item];
      const extra = ord.extras;
      const amount = ord.cnt;
      let orderItem = ord.Item.name;

      if(ord.Item.Category.showAmount) {
        orderItem = `${orderItem} ${showAmount(ord.Item.amount)}${ord.Item.Unit.name}`;
      }

      printData.push(deliveryNoteLine(amount, orderItem, extra));
      printData.push(ENTER);
    }

    printData.push(FEED, PAPER_PART_CUT);

    printJob(printer, printData);
  }

  bill(printer, data){
    const order = this.transformOrder(data);

    const printData = []
    printData.push(CHAR_CODE);

    printData.push(leftPadding(`${order.Table.name}/${order.Table.Area.name}`,48), ENTER);
    printData.push(TXT_2HEIGHT, 'RECHNUNG', TXT_NORMAL, ENTER);
    printData.push(rightPadding(`Nr. ${order.id}`, 24), leftPadding(formatDate(order.createdAt), 24), ENTER);

    printData.push(ENTER);
    printData.push(billHeader(), ENTER);
    for (const item in order.Orderitems) {
      const ord = order.Orderitems[item]
      let price = ord.Item.price;
      const amount = ord.cnt;
      const sum = (price * amount).toFixed(2);
      let orderItem = ord.Item.name;

      //workaround for sequelize/postgres. price and other decimal are of type string
      price = (price * 1).toFixed(2);

      if(ord.Item.Category.showAmount) {
        orderItem = `${orderItem} ${showAmount(ord.Item.amount)}${ord.Item.Unit.name}`;
      }

      printData.push(billLine(amount, orderItem, price, sum), ENTER);
    }

    printData.push(ENTER);
    printData.push(leftPadding('Gesamtsumme:', 28), leftPadding(`${(order.totalAmount * 1).toFixed(2)}`, 20))

    printData.push(ENTER, ENTER, centerPadding(`Es bediente Sie ${order.User.firstname} ${order.User.lastname}`,48))
    printData.push(FEED, PAPER_PART_CUT);

    printJob(printer, printData);
  }

  token_coin(printer, data) {
    let orderItem = data.Item.name.toUpperCase().substr(0, 46);
    if(data.Item.Category.showAmount) {
      orderItem = `${orderItem.toUpperCase().substr(0, 35)} ${showAmount(data.Item.amount)}${data.Item.Unit.name}`;
    }

    const printData = []
    printData.push(CHAR_CODE);
    printData.push(ENTER);
    printData.push(rightPadding('WERTMARKE FÜR', 24), leftPadding(formatDate(data.createdAt), 24), ENTER);

    printData.push(ENTER, ENTER, ENTER);
    printData.push(TXT_2HEIGHT, centerPadding('1x ' + orderItem, 48), TXT_NORMAL);
    printData.push(ENTER, ENTER, ENTER);
    printData.push(centerPadding('Oberländer Bataillons-Schützenfest', 48))
    printData.push(FEED, PAPER_PART_CUT);
    printJob(printer, printData);
  }

  transformOrder(data){
    let tmp = {};
    let order;
    let orderitem;
    for(let key in data.Orderitems) {
      orderitem = data.Orderitems[key]
      if (tmp[orderitem.ItemId + '_' + orderitem.extras]) {
        tmp[orderitem.ItemId + '_' + orderitem.extras].cnt = tmp[orderitem.ItemId + '_' + orderitem.extras].cnt + 1;
      }
      else
      {
        tmp[orderitem.ItemId + '_' + orderitem.extras] = orderitem;
        tmp[orderitem.ItemId + '_' + orderitem.extras].cnt = 1;
      }
    }
    order = data;
    order.Orderitems = tmp;
    return order;
  }

}

function printJob(printerName, data) {
  printer.printDirect({
    data: toPrintBuffer(data),
    printer: printerName,
    type: 'RAW',
    success(jobID){
      console.log('sent to printer with ID: '+jobID);
    },
    error(err){
      console.log('Printer not working', err)
      console.log(decoder.write(toPrintBuffer(data)));
    }
  });
}

function billLine(amount, item, price, sum) {
  amount = rightPadding(amount + 'x', 7);
  item = rightPadding(item, 20);
  price = leftPadding(price, 9);
  sum = leftPadding(sum, 9);
  return amount.concat(' ', item, ' ', price, ' ', sum);
}

function deliveryNoteLine(amount, orderItem, extra) {
  const whitespace8 = '        ';
  let tmp = rightPadding(`${amount} x`, 7) + ' ' + rightPadding(orderItem) + '\n';

  if(extra) {
    const line_count = Math.round(extra.length / 40) + 1
    tmp += whitespace8 + next40(0, extra) + '\n';

    for (let i = 1; i < line_count; i++) {
      tmp += whitespace8 + next40(i, extra) + '\n';
    }
  }

  return tmp;
}

function billHeader() {
  const amount = rightPadding('Menge', 7);
  const item = rightPadding('Artikel', 20);
  const price = leftPadding('Preis', 9);
  const sum = leftPadding('Summe', 9);
  return amount.concat(' ', item, ' ', price, ' ', sum);
}

function deliveryNoteHeader() {
  const amount = rightPadding('Menge', 7);
  const item = rightPadding('Artikel', 40);
  return amount.concat(' ', item);
}

function rightPadding(str, amount) {
  str = String(str);
  const tmp = amount - str.length;
  const strFactory= '                                                                       ';
  if(tmp < 0) {
    return str.substr(0, amount - 3) + '...';
  }

  return str.concat(strFactory.substr(0, amount - str.length));
}

function leftPadding(str, amount) {
  str = String(str);
  const tmp = amount - str.length;
  const strFactory= '                                                                       ';
  if(tmp < 0) {
    return str.substr(0, amount - 3) + '...';
  }

  return strFactory.substr(0, amount - str.length).concat(str);
}

function centerPadding(str, amount) {
  str = String(str);
  const tmp = amount - str.length;
  const strFactory= '                                                                       ';
  if(tmp < 0) {
    return str.substr(0, amount);
  } else {
    const pad = strFactory.substr(0, (amount - str.length)/2);
    const tmp = pad.concat(str);
    if(str % 2 === 0) {
      return tmp.concat(str);
    }
    return tmp.concat(pad);
  }
}

function formatDate(dbdate) {
  const time = new Date(dbdate);
  const hour = leftZero(time.getHours());
  const minutes = leftZero(time.getMinutes());
  const day = leftZero(time.getDate());
  const month = leftZero(time.getMonth());

  return `${hour}:${minutes} ${day}.${month}`;
}

function leftZero(str) {
  str = String(str);
  if(str.length < 2) {
    return '0'+str;
  }
  return str;
}

function showAmount(data) {
  switch(data){
  case 0.125:
    return "1/8";
  case 0.25:
    return "1/4";
  case 0.75:
    return "3/4";
  default:
    return data;
  }
}


function next40(idx, str) {
  return str.substr(idx * 40, 40);
}

function toPrintBuffer(data) {
  let result = [];
  for(let i = 0; i < data.length; i++) {
    if(typeof data[i] === 'string') {
      result = result.concat(data[i].toBytes());
    } else {
      result = result.concat(data[i]);
    }
  }
  return Buffer.from(result);
}

module.exports = new Print(48);
