const PAPER_FULL_CUT = [ 0x1d, 0x56, 0x00 ];
const PAPER_PART_CUT = [ 0x1d, 0x56, 0x01 ];
const CHAR_CODE = [27, 116, 6]; // West Europe

const FEED = '\n\n\n\n\n\n\n';
const ENTER = '\n';

const TXT_2HEIGHT =  [ 0x1b, 0x21, 0x10 ];
const TXT_NORMAL =  [ 0x1b, 0x21, 0x00 ];

const util = require('./util');
const t = require('../config/receipt');

class layout {
  deliveryNote(order) {
    const printData = [];
    printData.push(CHAR_CODE);

    const divider = Array(49).join('-');
    const headerLine = `T ${order.table?.name || '-'} / ${areaName(order.table?.area)}`;

    printData.push(util.cpad(headerLine, 48), ENTER);
    printData.push(TXT_2HEIGHT, util.cpad(t.deliveryNoteTitle, 48), TXT_NORMAL, ENTER);
    printData.push(util.rpad(`${t.nr} ${order.number}`, 24), util.lpad(util.formatDate(order.createdAt), 24), ENTER);
    printData.push(divider, ENTER);

    printData.push(util.rpad(t.quantity, 7), ' ', util.rpad(t.item, 40), ENTER);
    printData.push(divider, ENTER);

    order.orderitems.forEach((orderitem) => {
      let orderItemString = orderitem.item.name;

      if(orderitem.item.category.showAmount) {
        orderItemString = `${orderItemString} ${showAmount(orderitem.item.amount)}${orderitem.item.unit.name}`;
      }

      let line = util.rpad(`${orderitem.count} x`, 7) + ' ' + util.rpad(orderItemString, 40) + '\n';

      if(orderitem.extras) {
        const extrasLines = wrapText(orderitem.extras, 42);
        extrasLines.forEach((extraLine) => {
          line += `    + ${extraLine}\n`;
        });
      }

      printData.push(line);
    });

    printData.push(divider, ENTER);
    printData.push(FEED, PAPER_PART_CUT);
    return printData.reduce((a,b) => a.concat(b));
  }

  bill(order) {
    const printData = [];
    printData.push(CHAR_CODE);
    if(order.table) {
      printData.push(util.lpad(`${order.table.name}/${areaName(order.table.area)}`,48), ENTER);
    }
    printData.push(TXT_2HEIGHT, t.billTitle, TXT_NORMAL, ENTER);
    printData.push(util.rpad(`${t.nr} ${order.number}`, 24), util.lpad(util.formatDate(order.createdAt), 24), ENTER);

    printData.push(ENTER);
    printData.push(util.rpad(t.quantity, 7), ' ', util.rpad(t.item, 20),' ', util.lpad(t.price, 9), ' ', util.lpad(t.sum, 9), ENTER)
    order.orderitems.forEach((orderitem) => {
      let price = orderitem.item.price;
      const sum = (price * orderitem.count).toFixed(2);
      let name = orderitem.item.name;

      // workaround for sequelize/postgres. price and other decimal are of type string
      price = (price * 1).toFixed(2);

      if(orderitem.item.category.showAmount) {
        name = `${name} ${showAmount(orderitem.item.amount)}${orderitem.item.unit.name}`;
      }

      printData.push(util.rpad(orderitem.count + ' x', 7), ' ', util.rpad(name, 20), ' ', util.lpad(price, 9), ' ', util.lpad(sum, 9), ENTER);
    });

    const totalSum = order.orderitems.reduce((acc, orderitem) => acc + orderitem.count * orderitem.item.price, 0);

    printData.push(ENTER);
    printData.push(util.lpad(t.totalSum, 28), util.lpad(`${totalSum.toFixed(2)}`, 20));

    printData.push(ENTER, ENTER, util.cpad(`${t.waiterIntro} ${order.user.firstname} ${order.user.lastname}`,48));
    printData.push(FEED, PAPER_PART_CUT);

    return printData.reduce((a,b) => a.concat(b));
  }

  tokenCoin(order, eventName) {
    const printData = [];
    let item = order.item.name.toUpperCase().substr(0, 46);
    if(order.item.category.showAmount) {
      item = `${item.toUpperCase().substr(0, 35)} ${showAmount(order.item.amount)}${order.item.unit.name}`;
    }

    printData.push(CHAR_CODE);
    printData.push(ENTER);
    printData.push(util.rpad(t.tokenCoin, 24), util.lpad(util.formatDate(order.createdAt), 24), ENTER);

    printData.push(ENTER, ENTER, ENTER);
    printData.push(TXT_2HEIGHT, util.cpad('1x ' + item, 48), TXT_NORMAL);
    printData.push(ENTER, ENTER, ENTER);
    printData.push(util.cpad(eventName, 48));
    printData.push(FEED, PAPER_PART_CUT);

    let printSequence = printData;
    for(let i = 0; i < order.count - 1; i++) {
      printSequence = printSequence.concat(printData);
    }
    return printSequence;
  }

  printerTest(printer) {
    const printData = [];
    printData.push(CHAR_CODE);
    printData.push(ENTER);
    printData.push(TXT_2HEIGHT, util.cpad(printer.name || "Unbenannter Drucker", 48), TXT_NORMAL);
    printData.push(ENTER);
    printData.push(ENTER);
    printData.push(TXT_2HEIGHT, util.cpad(printer.systemName, 48), TXT_NORMAL);
    printData.push(FEED, PAPER_PART_CUT);

    return printData.reduce((a,b) => a.concat(b));
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

function areaName(area) {
  return area ? area.name : " - "
}

function wrapText(text, width) {
  if (!text) return [];
  const normalized = String(text).trim();
  if (!normalized) return [];
  const lines = [];
  for (let i = 0; i < normalized.length; i += width) {
    lines.push(normalized.substr(i, width));
  }
  return lines;
}

module.exports = new layout();
