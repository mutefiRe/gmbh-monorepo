const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const proxyquire = require('proxyquire');

function NmapScan() {
  return {
    on(method, cb){
      if(method === 'complete') {
        cb([
          {
            "ip":"192.168.1.3",
            "openPorts":[
              {
                "port":80
              }, {
                "port":9100
              }
            ]
          }])
      }
      if(method === 'error') {
        cb();
      }
    }
  };
}

const network = proxyquire('../network', {
  'os': {
    networkInterfaces() {
      return {
        lo:
        [ { address: '127.0.0.1',
          family: 'IPv4',
          internal: true },
        { address: '::1',
          family: 'IPv6',
          internal: true } ],
        wlp9s0:
        [ { address: '192.168.1.3',
          family: 'IPv4',
          internal: false },
        { address: 'fe80::7956:c215:b58d:41ba',
          family: 'IPv6',
          internal: false } ]
      }
    }
  },
  'node-nmap': {nodenmap: {NmapScan}},
  'arp-a': {
    table(cb) {
      cb( undefined , {
        ip: '192.168.1.3',
        mac: '02:82:ef:14:00:31'
      });
      cb (undefined, undefined);
    }
  }
});

describe('network getIp test', () => {
  it('should return ip with asterix', () => {
    assert.equal(network.getIp(), "192.168.1.*");
  });
});

describe('network getPrinters test', () => {
  it('should return list of printer ip', async () => {
    const result = await network.getPrinterIps();
    assert.deepEqual(result, ['192.168.1.3']);
  });
});

describe('network addMacToIpsMap test', () => {
  it('should add mac adress to ip', async () => {
    const ips = new Map([['192.168.1.3', null]]);
    const result = await network.addMacToIpsMap(ips);
    assert.deepEqual([...result], [['192.168.1.3', '02:82:ef:14:00:31']]);
  });
});
