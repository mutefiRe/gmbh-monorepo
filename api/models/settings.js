"use strict";

module.exports = function(sequelize, DataTypes) {
  let Setting = sequelize.define("Setting", {
    name: {type: DataTypes.STRING, allowNull: false,  unique: true},
    begin_date: {type: DataTypes.STRING, allowNull: true,  unique: false},
    end_date: {type: DataTypes.STRING, allowNull: false,  unique: false},
  }/*, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Task)
      }
    }
  }*/);
  Setting.sync();

  return Setting;
};

