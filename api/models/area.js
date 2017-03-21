"use strict";

module.exports = function(sequelize, DataTypes) {
  const Area  = sequelize.define("area", {
    name: {type: DataTypes.STRING, allowNull: false, unique: false}
  }, {
    classMethods: {
      associate(models) {
        Area.hasMany(models.Table,      {onDelete: 'NO ACTION'});
        Area.belongsToMany(models.User, {through: 'userarea', onDelete: 'NO ACTION'});
      }
    }
  });
  return Area;
};
