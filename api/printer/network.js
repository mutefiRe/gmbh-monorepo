const nmapConfig = require('../config/config').nmap;
const ifaces = require('os').networkInterfaces();
const nmap = require('node-nmap');
const arp = require('arp-a');

module.exports = {
  getIp() {
    const addresses = [];
    Object.keys(ifaces).forEach((ifname) => {
      ifaces[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
          return;
        }
        addresses.push(iface.address);
      });
    })
    return addresses[0].split('.').splice(0, 3).join('.') + '.*';
  },
  getPrinterIps() {
    const nmapscan = new nmap.nodenmap.NmapScan(this.getIp(), nmapConfig);
    return new Promise((resolve, reject) => {
      nmapscan.on('complete', function (devices) {
        resolve(
          devices
            .filter(device => device.openPorts.findIndex(p => p.port === 9100) !== - 1)
            .map(printer => printer.ip)
        );
      });
      nmapscan.on('error', function (error) {
        reject(error);
      });
      nmapscan.startScan();
    });
  },
  addMacToIpsMap(ips) {
    return new Promise((resolve, reject) => {
      arp.table(function (err, entry) {
        if (!!err) return reject('arp: ' + err.message);
        if (!entry) {
          resolve(ips);
          return;
        }

        if (ips.has(entry.ip)) {
          ips.set(entry.ip, entry.mac);
        }
      });
    });
  }
}
