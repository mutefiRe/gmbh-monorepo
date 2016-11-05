'use strict'

//Import Modules
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const Sequelize = require('sequelize');
const mysql = require('mysql');
const db = require('./models/index');
const bodyParser = require('body-parser');
const config = require('./config/config');
const socketioJwt = require('socketio-jwt');

app.set("io", io);
app.set("server", server);

io.use(socketioJwt.authorize({
  secret: config.secret,
  handshake: true
}));


db.sequelize.sync();

//Import Routes
const api = require('./router/api');
const authenticate = require('./router/authenticate')
const teapot = require('./router/teapot');
const data = require('./router/data');

server.listen(process.env.PORT || 8080, function(){
	console.log(`server listening to ${process.env.PORT || 8080}`)
});


// Routing
app.use(bodyParser.json())
app.all('*', function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', process.env.GMBH_FRONTEND || 'http://localhost:4200'); //allow acces from frontend server
    next()
  });
app.options('*', function(req, res) {
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, x-access-token');
  res.sendStatus(200)
});
app.use('/authenticate', authenticate);
app.use('/api', api);
app.use('/teapot', teapot);
app.use('/data', data);





// SOCKET HANDLING
io.on('connection', function(socket){

  //console.log(socket.handshake.decoded_token.username, 'connected');
  socket.emit("connected", true)


  socket.on('disconnect', function(){
  	//console.log('disconnected')
  });
});

exports = module.exports = server;
