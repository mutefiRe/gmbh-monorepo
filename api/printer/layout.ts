const PAPER_FULL_CUT = [0x1d, 0x56, 0x00];
const PAPER_PART_CUT = [0x1d, 0x56, 0x01];
const CHAR_CODE = [27, 116, 6]; // West Europe

const FEED = '\n\n\n\n';
const ENTER = '\n';

const TXT_2HEIGHT = [0x1b, 0x21, 0x10];
const TXT_NORMAL = [0x1b, 0x21, 0x00];

const util = require('./util');
const t = require('../config/receipt');

class layout {
  deliveryNote(order) {
    const printData = [];
    printData.push(CHAR_CODE);

    const divider = Array(49).join('-');

    let headerLine = `Ziel:`;
    if (order.customTableName) {
      headerLine += ` ${order.customTableName}`;
    } else if (order.table) {
      if (order.table.area?.short) {
        headerLine += ` ${order.table.area.short}`;
      }
      headerLine += ` ${order.table.name}`;
    }

    printData.push(TXT_2HEIGHT, util.cpad(headerLine, 48), TXT_NORMAL, ENTER);
    if (order.printCount && order.printCount > 0) {
      const notice = `ACHTUNG: ${order.printCount}. NACHDRUCK`;
      printData.push(util.cpad(notice, 48), ENTER);
    }
    const hasParts = order.printTotal && order.printTotal > 1;
    const orderNumber = order.number ? String(order.number) : '-';
    const leftLabel = hasParts
      ? `${t.nr} ${orderNumber} / ${order.printPart}`
      : `${t.nr} ${orderNumber}`;
    printData.push(util.rpad(leftLabel, 24), util.lpad(util.formatDate(order.createdAt), 24), ENTER);
    printData.push(divider, ENTER);

    printData.push(
      util.rpad(t.quantity, 7),
      util.rpad(t.item, 23),
      util.lpad(t.price, 9),
      util.lpad(t.sum, 9),
      ENTER
    );
    printData.push(divider, ENTER);

    order.orderitems.forEach((orderitem) => {
      let price = orderitem.item.price;
      const sum = (price * orderitem.count).toFixed(2);
      let orderItemString = orderitem.item.name;
      price = (price * 1).toFixed(2);

      if (orderitem.item.category.showAmount) {
        orderItemString = `${orderItemString} ${formatAmount(orderitem.item.amount)}${orderitem.item.unit.name}`;
      }

      let line = util.rpad(`${orderitem.count} x`, 7)
        + util.rpad(orderItemString, 23)
        + util.lpad(price, 9)
        + util.lpad(sum, 9)
        + '\n';

      if (orderitem.extras) {
        const extrasLines = wrapText(orderitem.extras, 38);
        extrasLines.forEach((extraLine, idx) => {
          const label = idx === 0 ? 'Bemerkung: ' : '';
          line += `    * ${label}${extraLine}\n`;
        });
      }

      printData.push(line);
    });

    const totalSum = order.orderitems.reduce((acc, orderitem) => acc + orderitem.count * orderitem.item.price, 0);

    const userLine = order.user && order.user.username
      ? `Aufgenommen von: ${order.user.username}`
      : '';

    printData.push(divider, ENTER);
    printData.push(util.rpad(userLine, 28), util.lpad(`${totalSum.toFixed(2)}`, 20), ENTER);
    printData.push(FEED, PAPER_PART_CUT);
    return printData.reduce((a, b) => a.concat(b));
  }

  tokenCoin(order, eventName) {
    const printData = [];
    let item = order.item.name.toUpperCase().substr(0, 46);
    if (order.item.category.showAmount) {
      item = `${item.toUpperCase().substr(0, 35)} ${formatAmount(order.item.amount)}${order.item.unit.name}`;
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
    for (let i = 0; i < order.count - 1; i++) {
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

    return printData.reduce((a, b) => a.concat(b));
  }
}

function formatAmount(amount) {
  const parsedAmount = parseFloat(amount);
  if (Number.isNaN(parsedAmount)) return amount;
  if (Number.isInteger(parsedAmount)) return parsedAmount.toString();
  return parsedAmount.toFixed(2).replace(/\.00$/, '').replace(/(\.[1-9]*)0$/, '$1');
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
