"use strict";

module.exports = function(sequelize, DataTypes) {
  let Organization = sequelize.define("Organization", {
    uid: {type: DataTypes.STRING, allowNull: false,  unique: true},
    name: {type: DataTypes.STRING, allowNull: false,  unique: false},
    street: {type: DataTypes.STRING, allowNull: true,  unique: false},
    street_number: {type: DataTypes.STRING, allowNull: true,  unique: false},
    postalcode: {type: DataTypes.STRING, allowNull: true, unique: false},
    city: {type: DataTypes.STRING, allowNull: true, unique: false},
    telephone: {type: DataTypes.STRING, allowNull: true, unique: false}
  }/*, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Task)
      }
    }
  }*/);
  Organization.sync();

  return Organization;
};
