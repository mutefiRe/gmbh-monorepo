"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const socketio_jwt_1 = __importDefault(require("socketio-jwt"));
const socket_io_1 = require("socket.io");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const pino_http_1 = __importDefault(require("pino-http"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const OpenApiValidator = __importStar(require("express-openapi-validator"));
const umzug_1 = require("umzug");
const config = require('./config/config');
const index_1 = __importDefault(require("./models/index"));
const logger = require('./util/logger');
const api = require('./router/api');
const authenticate = require('./router/authenticate');
const teapot = require('./router/teapot');
const error = require('./router/error');
const api_auth_1 = __importDefault(require("./middleware/api-auth"));
// Import Modules
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
app.set("io", io);
app.set("server", server);
io.use(socketio_jwt_1.default.authorize({
    secret: config.secret,
    handshake: true
}));
const runMigrations = async () => {
    const umzug = new umzug_1.Umzug({
        migrations: {
            glob: path_1.default.join(process.cwd(), 'migrations', '*.js')
        },
        context: {
            queryInterface: index_1.default.sequelize.getQueryInterface(),
            Sequelize: index_1.default.sequelize.Sequelize
        },
        storage: new umzug_1.SequelizeStorage({ sequelize: index_1.default.sequelize }),
        logger: {
            info: (message) => logger.info({ message }, 'migration'),
            warn: (message) => logger.warn({ message }, 'migration'),
            error: (message) => logger.error({ message }, 'migration'),
            debug: (message) => logger.debug({ message }, 'migration')
        }
    });
    await umzug.up();
};
const startServer = async () => {
    const shouldMigrate = process.env.GMBH_DB_AUTO_MIGRATE !== 'false';
    if (shouldMigrate) {
        await runMigrations();
    }
    else {
        logger.info('db migrations disabled');
    }
    server.listen(process.env.PORT || 8080, function () {
        const port = process.env.PORT || 8080;
        logger.info({ port }, 'server listening');
    });
};
startServer().catch((err) => {
    logger.error({ err }, 'failed to start server');
    process.exit(1);
});
// Routing
app.use(express_1.default.json({ limit: '5mb' }));
app.use(express_1.default.urlencoded({ limit: '5mb', extended: true }));
app.use((0, cookie_parser_1.default)());
const logLevel = (process.env.LOG_LEVEL || '').toLowerCase();
const enableRequestLogs = logLevel === 'debug';
app.use((0, pino_http_1.default)({
    logger,
    autoLogging: enableRequestLogs,
    customLogLevel: (req, res, err) => {
        if (err || res.statusCode >= 500)
            return 'error';
        if (res.statusCode >= 400)
            return 'warn';
        return 'info';
    }
}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.GMBH_FRONTEND || '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, x-access-token, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});
const openapiPath = path_1.default.resolve(process.cwd(), 'openapi', 'openapi.yaml');
const openapiFallbackPath = path_1.default.resolve(__dirname, '..', 'openapi', 'openapi.yaml');
const openapiSpecPath = fs_1.default.existsSync(openapiPath) ? openapiPath : openapiFallbackPath;
const readOpenApiSpec = () => {
    if (!fs_1.default.existsSync(openapiSpecPath)) {
        return null;
    }
    const raw = fs_1.default.readFileSync(openapiSpecPath, 'utf-8');
    return js_yaml_1.default.load(raw);
};
const swaggerUiOptions = {
    swaggerOptions: {
        url: '/api/openapi.json',
        persistAuthorization: true
    }
};
app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(undefined, swaggerUiOptions));
app.get('/api/openapi.json', (req, res) => {
    const spec = readOpenApiSpec();
    if (!spec) {
        return res.status(404).json({ errors: { msg: 'openapi spec not found' } });
    }
    res.status(200).json(spec);
});
app.get('/openapi.json', (req, res) => {
    const spec = readOpenApiSpec();
    if (!spec) {
        return res.status(404).json({ errors: { msg: 'openapi spec not found' } });
    }
    res.status(200).json(spec);
});
app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(undefined, swaggerUiOptions));
if (fs_1.default.existsSync(openapiSpecPath)) {
    const validator = OpenApiValidator.middleware({
        apiSpec: openapiSpecPath,
        validateRequests: true,
        validateResponses: false,
        ignorePaths: /^(\/docs|\/openapi\.json|\/api\/docs|\/api\/openapi\.json|\/authenticate($|\/)|\/error|\/teapot)/i
    });
    app.use(validator);
}
else {
    logger.warn({ openapiSpecPath }, 'openapi spec not found; request validation disabled');
}
app.use('/api', api_auth_1.default);
app.use('/authenticate', authenticate);
app.use('/api', api);
app.use('/teapot', teapot);
app.use('/error', error);
/**
 * @api {get} check/ Health Check
 * @apiName HealthCheck
 * @apiGroup HealthCheck

 * @apiSuccess {String} OK OK
 */
// Socket handling
io.on('connection', function (socket) {
    socket.emit("connected", true);
    socket.on('disconnect', function () {
        // console.log('disconnected')
    });
});
process.on('unhandledRejection', (reason, p) => {
    logger.error({ reason, promise: p }, 'unhandled rejection');
    // application specific logging, throwing an error, or other logic here
});
process.on('uncaughtException', (err) => {
    logger.error({ err }, 'uncaught exception');
});
module.exports = server;
