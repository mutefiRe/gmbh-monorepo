'use strict'

//Import Modules
const app = require('express')();
const server = require('http').Server(app)
const io = require('socket.io')(server);
const Sequelize = require('sequelize');
const mysql = require('mysql');
const bodyParser = require('body-parser');

//Import Routes
const api = require('./router/api');
const authenticate = require('./router/authenticate')

server.listen(8080, function(){
	//console.log("server listening to 8080")
});


// Routing
app.use(bodyParser.json())
app.get('/', function(req, res){
  res.send("Welcome to our API<br>Authenticate at /authenticate<br>to get Access to /api")}
  );
app.use('/authenticate', authenticate);
app.use('/api', api);


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

exports = module.exports = app;
