"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = require('pino')({
    level: process.env.LOG_LEVEL || 'info',
    base: {
        service: 'gmbh-api'
    },
    timestamp: require('pino').stdTimeFunctions.isoTime
});
module.exports = logger;
