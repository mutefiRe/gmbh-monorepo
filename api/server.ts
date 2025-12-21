import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import jwtSocket from 'socketio-jwt';
import { Server as SocketIOServer } from 'socket.io';
import swaggerUi from 'swagger-ui-express';
import pinoHttp from 'pino-http';
import yaml from 'js-yaml';
import * as OpenApiValidator from 'express-openapi-validator';
import { Umzug, SequelizeStorage } from 'umzug';
const config = require('./config/config');
import db from './models/index';
const logger = require('./util/logger');
import api from './router/api';
import authenticate from './router/authenticate';
const teapot = require('./router/teapot');
const error = require('./router/error');
import apiAuth from './middleware/api-auth';

// Import Modules
const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

app.set("io", io);
app.set("server", server);

io.use(jwtSocket.authorize({
  secret: config.secret,
  handshake: true
}));

const runMigrations = async () => {
  const umzug = new Umzug({
    migrations: {
      glob: path.join(process.cwd(), 'migrations', '*.js')
    },
    context: {
      queryInterface: db.sequelize.getQueryInterface(),
      Sequelize: db.sequelize.Sequelize
    },
    storage: new SequelizeStorage({ sequelize: db.sequelize }),
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
  } else {
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
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(cookieParser());
const logLevel = (process.env.LOG_LEVEL || '').toLowerCase();
const enableRequestLogs = logLevel === 'debug';
app.use(pinoHttp({
  logger,
  autoLogging: enableRequestLogs,
  customLogLevel: (req, res, err) => {
    if (err || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  }
}));
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', process.env.GMBH_FRONTEND || '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, x-access-token, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

const openapiPath = path.resolve(process.cwd(), 'openapi', 'openapi.yaml');
const openapiFallbackPath = path.resolve(__dirname, '..', 'openapi', 'openapi.yaml');
const openapiSpecPath = fs.existsSync(openapiPath) ? openapiPath : openapiFallbackPath;
const readOpenApiSpec = () => {
  if (!fs.existsSync(openapiSpecPath)) {
    return null;
  }
  const raw = fs.readFileSync(openapiSpecPath, 'utf-8');
  return yaml.load(raw) as Record<string, unknown>;
};

const swaggerUiOptions = {
  swaggerOptions: {
    url: '/api/openapi.json',
    persistAuthorization: true
  }
};
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(undefined, swaggerUiOptions));
app.get('/api/openapi.json', (req: Request, res: Response) => {
  const spec = readOpenApiSpec();
  if (!spec) {
    return res.status(404).json({ errors: { msg: 'openapi spec not found' } });
  }
  res.status(200).json(spec);
});
app.get('/openapi.json', (req: Request, res: Response) => {
  const spec = readOpenApiSpec();
  if (!spec) {
    return res.status(404).json({ errors: { msg: 'openapi spec not found' } });
  }
  res.status(200).json(spec);
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(undefined, swaggerUiOptions));

if (fs.existsSync(openapiSpecPath)) {
  const validator = OpenApiValidator.middleware({
    apiSpec: openapiSpecPath,
    validateRequests: true,
    validateResponses: false,
    ignorePaths: /^(\/docs|\/openapi\.json|\/api\/docs|\/api\/openapi\.json|\/authenticate($|\/)|\/error|\/teapot)/i
  });
  app.use(validator);
} else {
  logger.warn({ openapiSpecPath }, 'openapi spec not found; request validation disabled');
}

app.use('/api', apiAuth);
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
io.on('connection', function (socket: any) {

  socket.emit("connected", true);

  socket.on('disconnect', function () {
    // console.log('disconnected')
  });
});

export = server;

process.on('unhandledRejection', (reason, p) => {
  logger.error({ reason, promise: p }, 'unhandled rejection');
  // application specific logging, throwing an error, or other logic here
});

process.on('uncaughtException', (err) => {
  logger.error({ err }, 'uncaught exception');
});
