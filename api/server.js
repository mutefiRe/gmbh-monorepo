'use strict';

// Import Modules
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const db = require('./models/index');
const cookieParser = require('cookie-parser');
// Express 4.16+ has built-in body parsing
const config = require('./config/config');
const jwtSocket = require('socketio-jwt');

app.set("io", io);
app.set("server", server);

io.use(jwtSocket.authorize({
  secret: config.secret,
  handshake: true
}));


db.sequelize.sync();

// Import Routes
const api = require('./router/api');
const authenticate = require('./router/authenticate');
const teapot = require('./router/teapot');
const error = require('./router/error');

server.listen(process.env.PORT || 8080, function () {
  console.log(`server listening to ${process.env.PORT || 8080}`);
});

// Routing
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.GMBH_FRONTEND || '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, x-access-token');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
app.use('/authenticate', authenticate);
app.use('/api', api);
app.use('/teapot', teapot);

app.use('/error', error);

app.use('/docs', express.static('docs'));

/**
 * @api {get} check/ Health Check
 * @apiName HealthCheck
 * @apiGroup HealthCheck

 * @apiSuccess {String} OK OK
 */

app.get('/check', function (req, res) {
  res.status(200).send("OK")
});

// Socket handling
io.on('connection', function (socket) {

  socket.emit("connected", true);

  socket.on('disconnect', function () {
    // console.log('disconnected')
  });
});

exports = module.exports = server;

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise ', p, ' reason: ', reason);
  // application specific logging, throwing an error, or other logic here
});

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception thrown: ', err);
});
