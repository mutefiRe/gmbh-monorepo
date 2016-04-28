"use strict";

module.exports = function(sequelize, DataTypes) {
  let User = sequelize.define("User", {
    username: {type: DataTypes.STRING, allowNull: false,  unique: true},
    firstname: {type: DataTypes.STRING, allowNull: true,  unique: false},
    lastname: {type: DataTypes.STRING, allowNull: true,  unique: false},
    password: {type: DataTypes.STRING, allowNull: false,  unique: false},
    permission: {type: DataTypes.INTEGER, allowNull:false, unique: false},
    token: {type: DataTypes.STRING, allowNull:true, unique:true}
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

