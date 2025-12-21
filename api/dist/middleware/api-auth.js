"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = apiAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const models_1 = __importDefault(require("../models"));
async function apiAuth(req, res, next) {
    if (req.path.startsWith('/docs') || req.path.startsWith('/openapi.json')) {
        return next();
    }
    const authHeader = req.headers?.authorization || '';
    const bearerToken = authHeader.toLowerCase().startsWith('bearer ')
        ? authHeader.slice(7).trim()
        : undefined;
    const token = bearerToken
        || req.body?.token
        || req.query?.token
        || req.headers?.['x-access-token']
        || req.cookies?.['x-gmbh-token'];
    if (!token) {
        res.status(401).send({
            errors: { msg: 'auth.tokenError' }
        });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.secret);
        req.decoded = decoded;
        const role = decoded?.role;
        if (role === 'waiter') {
            const setting = await models_1.default.Setting.findOne();
            const activeEventId = setting?.activeEventId || null;
            const tokenEventId = decoded?.eventId || null;
            if (activeEventId && tokenEventId && activeEventId !== tokenEventId) {
                res.status(401).send({ errors: { msg: 'auth.eventChanged' } });
                return;
            }
        }
        next();
    }
    catch (error) {
        res.status(401).send({
            errors: { msg: 'auth.tokenError' }
        });
    }
}
