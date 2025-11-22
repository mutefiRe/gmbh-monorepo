const proxyquire = require('proxyquire').noCallThru();

const chai = require('chai');
const expect = chai.expect;
const db = require('../../models');
const { clean } = require('./../helper.js');


const control = proxyquire('../../printer/control', {
  './network': {
    getPrinterIps() {
      return Promise.resolve([
        "127.0.0.1",
        "168.192.1.200"
      ]);
    },
    addMacToIpsMap(ips) {
      ips.set("127.0.0.1", "test");
      ips.set("168.192.1.200", "test2");
      return Promise.resolve(ips);
    }
  },
  'child_process': {
    exec(command, cb) {
      cb();
    }
  }
});

describe('tests for printer control', () => {
  before(clean);
  it('should add pinter to database', () => {
    return control.updatePrinters()
    .then(() => db.Printer.findAll())
    .then(printers => {
      printers = printers.map(instance => instance.dataValues);
      const expectedValues = ["test", "test2"];
      expect(expectedValues).to.include(printers[0].systemName)
      expect(expectedValues).to.include(printers[1].systemName)
    })
  });
})
