const ifaces = require('os').networkInterfaces();
const localDevices = require('local-devices');

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
    });
    return addresses[0].split('.').splice(0, 3).join('.') + '.*';
  },

  getPrinterIps() {
    // localDevices returns a Promise with all devices on the local network
    return localDevices().then(devices => {
      // Filter for devices with port 9100 open (if available)
      // local-devices does not provide port info, so you may need to filter by known printer MAC prefixes or names
      // For now, return all IPs (customize as needed)
      return devices.map(device => device.ip);
    });
  },

  addMacToIpsMap(ips) {
    // localDevices returns MAC addresses as well
    return localDevices().then(devices => {
      devices.forEach(device => {
        if (ips.has(device.ip)) {
          ips.set(device.ip, device.mac);
        }
      });
      return ips;
    });
  }
};
