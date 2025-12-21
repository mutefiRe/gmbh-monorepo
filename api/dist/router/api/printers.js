"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = __importDefault(require("../../models"));
const control_1 = __importDefault(require("../../printer/control"));
const print_1 = __importDefault(require("../../printer/print"));
const printer_api_1 = __importDefault(require("../../printer/printer_api"));
const logger_1 = __importDefault(require("../../util/logger"));
const router = (0, express_1.Router)();
let lockSearch = false;
router.get('/', async function (req, res) {
    try {
        const printers = await models_1.default.Printer.findAll();
        const statuses = await Promise.all(printers.map(async (printer) => {
            try {
                const status = await printer_api_1.default.status(printer.systemName);
                return { key: printer.systemName, online: status.online };
            }
            catch (err) {
                return { key: printer.systemName, online: false };
            }
        }));
        const includeQueue = String(req.query.includeQueue || '').toLowerCase() === 'true';
        const queues = includeQueue ? await Promise.all(printers.map(async (printer) => {
            try {
                const queue = await printer_api_1.default.queue(printer.systemName);
                return { key: printer.systemName, queue };
            }
            catch (err) {
                return { key: printer.systemName, queue: null };
            }
        })) : [];
        const statusMap = new Map(statuses.map((s) => [s.key, s.online]));
        const queueMap = new Map(queues.map((q) => [q.key, q.queue]));
        const printersWithStatus = printers.map((printer) => Object.assign({}, printer.toJSON(), {
            reachable: statusMap.get(printer.systemName) || false,
            queue: includeQueue ? queueMap.get(printer.systemName) : undefined
        }));
        res.send({ printers: printersWithStatus });
    }
    catch (error) {
        res.status(400).send({
            errors: {
                msg: error?.errors?.[0]?.message || error?.message
            }
        });
    }
});
router.get('/:id', async function (req, res) {
    try {
        const printer = await models_1.default.Printer.findOne({ where: { id: req.params.id } });
        if (printer === null) {
            res.status(404).send({
                errors: {
                    msg: "couldn't find any printer"
                }
            });
            return;
        }
        res.send({ printer });
    }
    catch (error) {
        res.status(400).send({
            errors: {
                msg: error?.errors?.[0]?.message || error?.message
            }
        });
    }
});
router.post('/:id/testprint', async function (req, res) {
    try {
        const printer = await models_1.default.Printer.findOne({ where: { id: req.params.id } });
        if (printer === null) {
            res.status(404).send({
                errors: {
                    msg: "couldn't find printer"
                }
            });
            return;
        }
        print_1.default.test(printer.dataValues);
        res.send({});
    }
    catch (error) {
        res.status(400).send({
            errors: {
                msg: error?.errors?.[0]?.message || error?.message
            }
        });
    }
});
router.post('/update', async function (req, res) {
    const io = req.app.get('io');
    if (!lockSearch) {
        lockSearch = true;
        try {
            const _printers = await control_1.default.updatePrinters();
            const printers = _printers || [];
            logger_1.default.info(`Updated printers: ${printers.length} printers found`);
            io.sockets.emit("update", { printers: printers.slice(printers.length / 2, printers.length) });
            res.send({ status: 'ok' });
            return;
        }
        catch (error) {
            logger_1.default.error('Error updating printers:', error);
            res.status(400).send({
                errors: {
                    msg: error?.errors?.[0]?.message || error?.message
                }
            });
            return;
        }
        finally {
            lockSearch = false;
        }
    }
    res.status(423);
    res.send({ status: 'locked' });
});
router.put('/:id', async function (req, res) {
    const io = req.app.get('io');
    try {
        const printer = await models_1.default.Printer.findOne({ where: { id: req.params.id } });
        if (printer === null) {
            throw new Error('printer not found');
        }
        const updated = await printer.update(req.body.printer);
        res.send({ printer: updated });
        io.sockets.emit("update", { printer: updated });
    }
    catch (error) {
        res.status(400).send({
            errors: {
                msg: error?.errors?.[0]?.message || error?.message
            }
        });
    }
});
router.delete('/:id', async function (req, res) {
    const io = req.app.get('io');
    try {
        const printer = await models_1.default.Printer.findOne({ where: { id: req.params.id } });
        if (printer === null) {
            throw new Error('printer not found');
        }
        await Promise.all([printer.destroy(), control_1.default.removePrinter(printer.systemName)]);
        res.send({});
        io.sockets.emit("delete", { type: 'printer', id: req.params.id });
    }
    catch (error) {
        res.status(400).send({
            errors: {
                msg: error?.errors?.[0]?.message || error?.message
            }
        });
    }
});
exports.default = router;
