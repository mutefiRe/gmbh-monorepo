const escpos = require('escpos');
escpos.USB = require('escpos-usb'); // Ensure escpos-usb is installed
function listUsbPrinters() {
    const devices = escpos.USB.findPrinter();
    return devices; // Array of USB device objects
}
function printToUsbPrinter(data) {
    const devices = listUsbPrinters();
    if (devices.length === 0) {
        throw new Error('No USB ESC/POS printers found');
    }
    const device = new escpos.USB();
    const printer = new escpos.Printer(device);
    device.open(() => {
        printer.text(data);
        printer.cut();
        printer.close();
    });
}
