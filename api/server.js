var server = require('http').createServer();
var io = require('socket.io')(server);
server.listen(8080, function(){
	console.log("server listening to 8080")
});




var mysql = require('mysql');
var Sequelize = require('sequelize');
var sequelize = new Sequelize('gmbh', 'root', '',
{
  host: "localhost",
  port: 3306
});


io.on('connection', function(socket){
  socket.emit("connected", true)
  

  socket.on('authenticationRequest', function(data){
  		if (data.password == "password")
  			authenticateUser(socket, data)
  })


  socket.on('disconnect', function(){
  	console.log('disconnected')
  });
});



function authenticateUser(socket, data){
	socket.emit("authenticationResponse", {"password": data.password, "authenticated":true, "message": "du darfst hier rein"})
}



