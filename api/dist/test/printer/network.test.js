"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const proxyquire = require('proxyquire');
const chai = require('chai');
const expect = chai.expect;
function NmapScan() {
    return {
        on(method, cb) {
            if (method === 'complete') {
                cb([
                    {
                        "ip": "192.168.1.3",
                        "openPorts": [
                            {
                                "port": 80
                            }, {
                                "port": 9100
                            }
                        ]
                    }
                ]);
            }
            if (method === 'error') {
                cb();
            }
        }
    };
}
const network = proxyquire('../../printer/network', {
    'os': {
        networkInterfaces() {
            return {
                lo: [{ address: '127.0.0.1',
                        family: 'IPv4',
                        internal: true },
                    { address: '::1',
                        family: 'IPv6',
                        internal: true }],
                wlp9s0: [{ address: '192.168.1.3',
                        family: 'IPv4',
                        internal: false },
                    { address: 'fe80::7956:c215:b58d:41ba',
                        family: 'IPv6',
                        internal: false }]
            };
        }
    },
    'node-nmap': { nodenmap: { NmapScan } },
    'arp-a': {
        table(cb) {
            cb(undefined, {
                ip: '192.168.1.3',
                mac: '02:82:ef:14:00:31'
            });
            cb(undefined, undefined);
        }
    }
});
describe('network getIp test', () => {
    it('should return ip with asterix', () => {
        expect(network.getIp()).to.be.equal("192.168.1.*");
    });
});
describe('network getPrinters test', () => {
    it('should return list of printer ip', () => {
        return network.getPrinterIps()
            .then(result => {
            expect(result).to.be.deep.equal(['192.168.1.3']);
        });
    });
});
describe('network addMacToIpsMap test', () => {
    it('should add mac adress to ip', () => {
        const ips = new Map([['192.168.1.3', null]]);
        return network.addMacToIpsMap(ips)
            .then(result => {
            expect([...result]).to.be.deep.equal([['192.168.1.3', '02:82:ef:14:00:31']]);
        });
    });
});
