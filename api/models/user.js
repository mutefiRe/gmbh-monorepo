"use strict";

module.exports = function(sequelize, DataTypes) {
  let User = sequelize.define("User", {
    username: {type: DataTypes.STRING, allowNull: false,  unique: true},
    firstname: {type: DataTypes.STRING, allowNull: true,  unique: false},
    lastname: {type: DataTypes.STRING, allowNull: true,  unique: false},
    password: {type: DataTypes.STRING, allowNull: false,  unique: false},
    permission: {type: DataTypes.INTEGER, allowNull:false, unique: false}
  }/*, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Task)
      }
    }
  }*/);
  User.sync();

  return User;
};
/*
"use strict";


const DataTypes = require('sequelize');
const DB = require("../config/DBconfig");
const sequelize = new DataTypes(DB().database, DB().user, DB().password, DB().host);

let User = sequelize.define('user', {
  username: {type: DataTypes.STRING, allowNull: false,  unique: true},
  firstname: {type: DataTypes.STRING, allowNull: true,  unique: false},
  lastname: {type: DataTypes.STRING, allowNull: true,  unique: false},
  password: {type: DataTypes.STRING, allowNull: false,  unique: false},
  permission: {type: DataTypes.INTEGER, allowNull:false, unique: false}
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
*/
