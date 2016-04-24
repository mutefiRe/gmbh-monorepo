'use strict'

//Import Modules
var app = require('express')();
var server = require('http').Server(app)
var io = require('socket.io')(server);
var Sequelize = require('sequelize');
var mysql = require('mysql');
var bodyParser = require('body-parser');

//Import Routes
var user = require('./router/user');

//Create Server, listening to 8080 -> http -> TODO CHANGE TO WSS
server.listen(8080, function(){
	//console.log("server listening to 8080")
});

// Routing
app.use(bodyParser.json())
app.use('/user', user)

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
