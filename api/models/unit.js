"use strict";

module.exports = function(sequelize, DataTypes) {
  const Unit = sequelize.define("unit", {
    name: {type: DataTypes.STRING, allowNull: true,  unique: true}
  });

  return Unit;
};
