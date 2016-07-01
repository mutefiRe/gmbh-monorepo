"use strict";

module.exports = function(sequelize, DataTypes) {
  let Area  = sequelize.define("Area", {
    name: {type: DataTypes.STRING, allowNull: false,  unique: false}
  }, {
    classMethods: {
      associate: function(models) {
        Area.hasMany(models.Table, {onDelete: 'RESTRICT'});
        Area.belongsToMany(models.User, {through: 'UserArea', onDelete: 'RESTRICT'});
      }
    }
  });
  return Area;
};
