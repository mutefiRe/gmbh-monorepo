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
	console.log("someone connected")
  socket.on('event', function(data){

  })





  socket.on('disconnect', function(){});
});




function foo() {
  		
  	}