"use strict";

module.exports = function(sequelize, DataTypes) {
  const Table  = sequelize.define("table", {
    name: {type: DataTypes.STRING,  allowNull: false, unique: false},
    x:    {type: DataTypes.INTEGER, allowNull: true,  unique: false},
    y:    {type: DataTypes.INTEGER, allowNull: true,  unique: false}
  }, {
    classMethods: {
      associate(models) {
        Table.belongsTo(models.Area, {onDelete: 'RESTRICT'});
      }
    }
  });
  return Table;
};
