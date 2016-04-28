"use strict";

module.exports = function(sequelize, DataTypes) {
  let Unit = sequelize.define("Unit", {
    name: {type: DataTypes.STRING, allowNull: true,  unique: true},
  }/*, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Task)
      }
    }
  }*/);
  Unit.sync();

  return Unit;
};
