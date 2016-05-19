"use strict";

module.exports = function(sequelize, DataTypes) {
  let Area  = sequelize.define("Area", {
    name: {type: DataTypes.STRING, allowNull: false,  unique: false}
  }, {
    classMethods: {
      associate: function(models) {
        Area.hasMany(models.Table);
        Area.belongsToMany(models.User, {through: 'UserArea'});
      }
    }
  });
  return Area;
};
