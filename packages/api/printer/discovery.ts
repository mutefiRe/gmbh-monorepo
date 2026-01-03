const usb = require('usb');
const net = require('net');

// ESC/POS USB Vendor/Product IDs (add more as needed)
const knownUsbPrinters = [
  { vendorId: 0x04b8, productId: 0x0e15 }, // Epson
  { vendorId: 0x0416, productId: 0x5011 }, // Some generic
  { vendorId: 0x0471, productId: 0x0055 }  // POS (vendor 1137, product: 85)
  // Add more known IDs here
];

// Discover USB ESC/POS printers
function discoverUsbPrinters() {
  const devices = usb.getDeviceList();
  return devices.filter(device =>
    knownUsbPrinters.some(
      p => device.deviceDescriptor.idVendor === p.vendorId &&
        device.deviceDescriptor.idProduct === p.productId
    )
  );
}

// Discover WiFi ESC/POS printers on a subnet
async function discoverWifiPrinters(subnet = '192.168.1.', start = 1, end = 254, timeout = 1000) {
  const found = [];
  const escposStatusCmd = Buffer.from([0x10, 0x04, 0x14]); // DLE EOT n (status command)
  const scanPromises = [];

  for (let i = start; i <= end; i++) {
    const ip = `${subnet}${i}`;
    scanPromises.push(new Promise<void>((resolve) => {
      const socket = new net.Socket();
      let isPrinter = false;

      socket.setTimeout(timeout);
      socket.connect(9100, ip, () => {
        socket.write(escposStatusCmd);
      });

      socket.on('data', data => {
        // If we get any response, assume it's a printer
        isPrinter = true;
        found.push(ip);
        socket.destroy();
      });

      socket.on('timeout', () => {
        socket.destroy();
        resolve();
      });

      socket.on('error', () => {
        socket.destroy();
        resolve();
      });

      socket.on('close', () => {
        resolve();
      });
    }));
  }

  await Promise.all(scanPromises);
  return found;
}

// Main
(async () => {
  console.log('Discovering USB ESC/POS printers...');
  const usbPrinters = discoverUsbPrinters();
  usbPrinters.forEach((device, idx) => {
    console.log(`USB Printer #${idx + 1}: VendorID=${device.deviceDescriptor.idVendor.toString(16)}, ProductID=${device.deviceDescriptor.idProduct.toString(16)}`);
  });

  console.log('Discovering WiFi ESC/POS printers...');
  // make this an ENV variable or config in real use
  const wifiPrinters = await discoverWifiPrinters('192.168.100.', 200, 220); // Adjust subnet/range as needed
  wifiPrinters.forEach((ip, idx) => {
    console.log(`WiFi Printer #${idx + 1}: IP=${ip}`);
  });

  if (usbPrinters.length === 0 && wifiPrinters.length === 0) {
    console.log('No ESC/POS printers found.');
  }
})();
