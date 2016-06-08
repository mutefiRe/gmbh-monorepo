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

const CENTER = [0x1b, 0x61, 0x1];
const LEFT = [0x1b, 0x61, 0x0];
const RIGHT = [0x1b, 0x61, 0x2];
const FEED = '\n\n\n\n\n\n\n'.toBytes();
const ENTER = '\n'.toBytes();

const TXT_2HEIGHT =  [ 0x1b, 0x21, 0x10 ];
const TXT_NORMAL =  [ 0x1b, 0x21, 0x00 ];



class Print {

  constructor(printername, length) {
    this.printername = printername;
    this.length = length;
  }
  printOrder(data){
    const order = this.transformOrder(data);

    //Item.category.showAmount
    //Item.amount;
    //Item.Unit.name

    const printData = []

    printData.push(leftPadding(`${order.Table.name}/${order.Table.Area.name}`,48), ENTER);
    printData.push(TXT_2HEIGHT, 'RECHNUNG', TXT_NORMAL, ENTER);
    printData.push(rightPadding(`Nr. ${order.id}`, 24), leftPadding(formatDate(order.createdAt), 24), ENTER);

    printData.push(ENTER);
    printData.push(orderHeader(), ENTER);
    for (const item in order.Orderitems) {
      const ord = order.Orderitems[item]
      let price = ord.Item.price;
      const amount = ord.cnt;
      const sum = (price * amount).toFixed(2);
      let orderItem = removeUmlauts(ord.Item.name);

      price = price.toFixed(2);

      if(ord.Item.Category.showAmount) {
        orderItem = `${orderItem} ${showAmount(ord.Item.amount)}${ord.Item.Unit.name}`;
      }

      printData.push(orderLine(amount, orderItem, price, sum), ENTER);
    }

    printData.push(ENTER);
    printData.push(leftPadding('Gesamtsumme:', 28), leftPadding(`${order.totalAmount.toFixed(2)}`, 20))

    printData.push(ENTER, ENTER, centerPadding(`Es bediente Sie ${order.User.firstname} ${order.User.lastname}`,48))
    printData.push(FEED, PAPER_PART_CUT);

    printer.printDirect({
      data: toPrintBuffer(printData),
      printer:'GMBH',
      type: 'RAW',
      success:function(jobID){
          //console.log('sent to printer with ID: '+jobID);
      },
      error:function(err){
        //console.log(err);
      }
    });
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

function orderLine(amount, item, price, sum) {
  const arr = [];
  amount = rightPadding((amount + 'x'), 7);
  item = rightPadding(item, 20);
  price = leftPadding(price, 9);
  sum = leftPadding(sum, 9);
  return amount.concat(' ', item, ' ', price, ' ', sum);
}

function orderHeader() {
  const amount = rightPadding('Menge', 7);
  const item = rightPadding('Artikel', 20);
  const price = leftPadding('Preis', 9);
  const sum = leftPadding('Summe', 9);
  return amount.concat(' ', item, ' ', price, ' ', sum);
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

const removeUmlauts = (function() {
  const translate_re = /[ßöäüÖÄÜ]/g;
  const translate = {
    'ä': 'a', 'ö': 'o', 'ü': 'u', 'ß': 's',
    'Ä': 'A', 'Ö': 'O', 'Ü': 'U'   // probably more to come
  };
  return function(s) {
    return ( s.replace(translate_re, function(match) {
      return translate[match];
    }) );
  }
})();

module.exports = new Print('GMBH', 48);
