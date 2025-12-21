const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');

const proxyquire = require('proxyquire');

const db = require('../../models');
const { clean } = require('../../__tests__/helper');


const control = proxyquire('../control', {
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
  it('should add pinter to database', async () => {
    await control.updatePrinters();
    const printers = (await db.Printer.findAll()).map(instance => instance.dataValues);
    const expectedValues = ["test", "test2"];
    assert.ok(expectedValues.includes(printers[0].systemName));
    assert.ok(expectedValues.includes(printers[1].systemName));
  });
});
