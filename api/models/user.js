"use strict";

var Sequelize = require('sequelize');
var sequelize = new Sequelize('gmbh', 'root', '',
{
  host: "localhost",
  port: 3306
});

let User = sequelize.define('user', {
  username: {type: Sequelize.STRING, allowNull: false,  unique: true},
  firstname: {type: Sequelize.STRING, allowNull: true,  unique: false},
  lastname: {type: Sequelize.STRING, allowNull: true,  unique: false},
  password: {type: Sequelize.STRING, allowNull: false,  unique: false},
  permission: {type: Sequelize.INTEGER, allowNull:false, unique: false}
})

User.sync();

function create(data){

	let thisuser = User.create({	
		username: data.username,
		firstname: data.firstname,
		lastname: data.lastname,
		password: data.password,
		permission: data.permission
	});
  return thisuser;
}



module.exports = {
	create: create,
	User: User
}
