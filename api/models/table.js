"use strict";

module.exports = function(sequelize, DataTypes) {
  let Table  = sequelize.define("Table", {
    name: {type: DataTypes.STRING, allowNull: false,  unique: false},
    x: {type: DataTypes.INTEGER, allowNull: true, unique: false},
    y: {type: DataTypes.INTEGER, allowNull: true, unique: false}
  }, {
    classMethods: {
      associate: function(models) {
        Table.belongsTo(models.Area);
      }
    }
  });
  return Table;
};
