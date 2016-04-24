'use strict'

//Import Modules
var Sequelize = require('sequelize');
var mysql = require('mysql');
var server = require('http').createServer();
var io = require('socket.io')(server);


//Create Server, listening to 8080 -> http -> TODO CHANGE TO WSS
server.listen(8080, function(){
	console.log("server listening to 8080")
});

// Connect do Database
var sequelize = new Sequelize('gmbh', 'root', '',
{
  host: "localhost",
  port: 3306
});

// Import Models
var User = require('./models/user.js');






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
  	console.log('disconnected')
  });
});






function authenticateUser(socket, data){
	socket.emit("authenticationResponse", {"password": data.password, "authenticated":true, "message": "du darfst hier rein"})
}

function authenticateUser(data){
	if (data.password == "password")
	return {"password": data.password, "authenticated":true, "message": "du darfst hier rein"}
	else return "fick di"
}

