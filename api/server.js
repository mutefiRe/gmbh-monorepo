'use strict'

//Import Modules
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const Sequelize = require('sequelize');
const mysql = require('mysql');
const db = require('./models/index');
const bodyParser = require('body-parser');

db.sequelize.sync();

//Import Routes
const api = require('./router/api');
const authenticate = require('./router/authenticate')
const teapot = require('./router/teapot');

server.listen(8080, function(){
	//console.log("server listening to 8080")
});


// Routing
app.use(bodyParser.json())
app.all('*', function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200'); //allow acces from frontend server
    next()
});
app.options('*', function(req, res) {
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, x-access-token');
    res.send(200)
});
app.use('/authenticate', authenticate);
app.use('/api', api);
app.use('/teapot', teapot);


/*
// SOCKET HANDLING
io.on('connection', function(socket){
  socket.emit("connected", true)
  socket.on('authenticationRequest', function(data){
    if (data.password == "password")
     authenticateUser(socket, data)
   else (data.password != "password")
     socket.emit("authenticationResponse", authenticateUser(data))
 })


  socket.on('disconnect', function(){
  	//console.log('disconnected')
  });
});

function authenticateUser(socket, data){
	socket.emit("authenticationResponse", {"password": data.password, "authenticated":true, "message": "du darfst hier rein"})
}

function authenticateUser(data){
	if (data.password == "password")
   return {"password": data.password, "authenticated":true, "message": "du darfst hier rein"}
  else return "raus hier"
}
*/

exports = module.exports = server;
