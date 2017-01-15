'use strict';

// Import Modules
const express    = require('express');
const app        = express();
const server     = require('http').Server(app);
const io         = require('socket.io')(server);
const db         = require('./models/index');
const bodyParser = require('body-parser');
const config     = require('./config/config');
const jwtSocket  = require('socketio-jwt');
const finalizer  = require('./lib/finalizer');

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
const data = require('./router/data');

server.listen(process.env.PORT || 8080, function(){
  console.log(`server listening to ${process.env.PORT || 8080}`);
});

// Routing
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
app.all('*', function(req, res, next){
  res.setHeader('Access-Control-Allow-Origin', process.env.GMBH_FRONTEND || '*'); // allow acces from frontend server
  next();
});
app.options('*', function(req, res) {
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, x-access-token');
  res.sendStatus(200);
});
app.use('/authenticate', authenticate);
app.use('/api', api);
app.use('/teapot', teapot);

app.use('/data', data);

app.use('/api', finalizer);
app.use('/docs', express.static('docs'))
/**
 * @api {get} check/ Health Check
 * @apiName HealthCheck
 * @apiGroup HealthCheck

 * @apiSuccess {String} OK OK
 */
app.get('/check', function(req, res){
  res.status(200).send("OK")
});


// Socket handling
io.on('connection', function(socket){

  socket.emit("connected", true);

  socket.on('disconnect', function(){
    // console.log('disconnected')
  });
});

exports = module.exports = server;
