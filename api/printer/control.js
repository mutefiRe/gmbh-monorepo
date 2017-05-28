const execCallbackstyle = require('child_process').exec;
const Network = require('./network');
const db = require('../models');

module.exports = {
  addPrinter(systemName, ip) {
    const command = `lpadmin -p ${systemName} -v socket://${ip}:9100/ -E`;
    return exec(command);
  },
  removePrinter(systemName) {
    const command = `lpadmin -x ${systemName}`;
    return exec(command);
  },
  updatePrinters() {
    return Network.getPrinterIps()
      .then((printersIps) => {
        const ips = new Map();
        printersIps.forEach((ip) => {
          ips.set(ip, null);
        })
        return ips;
      })
      .then((ips) => {
        return Network.addMacToIpsMap(ips)
      })
      .then((ips) => {
        const promises = [];
        ips.forEach((printer, ip) => promises.push(this.addPrinter(printer, ip)));
        ips.forEach((printer) => promises.push(
          db.Printer.create({systemName: printer})
          .catch(() => {
            return false;
          })
        ));
        return Promise.all(promises);
      })
  }
}

function exec(command) {
  return new Promise((resolve, reject) => {
    execCallbackstyle(command, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    })
  })
}
