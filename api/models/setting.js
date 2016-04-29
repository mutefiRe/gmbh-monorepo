"use strict";

module.exports = function(sequelize, DataTypes) {
  let Setting = sequelize.define("Setting", {
    name: {type: DataTypes.STRING, allowNull: false,  unique: false},
    beginDate: {type: DataTypes.DATE, allowNull: true,  unique: false},
    endDate: {type: DataTypes.DATE, allowNull: true,  unique: false},
  }/*, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Task)
      }
    }
  }*/);
  return Setting;
};

