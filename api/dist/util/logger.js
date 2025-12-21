const logger = require('pino')({
    level: process.env.LOG_LEVEL || 'info',
    base: {
        service: 'gmbh-api'
    },
    timestamp: require('pino').stdTimeFunctions.isoTime
});
module.exports = logger;
