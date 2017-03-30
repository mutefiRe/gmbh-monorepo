"use strict";

module.exports = function(sequelize, DataTypes) {
  const Area  = sequelize.define("area", {
    id:   {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
    name: {type: DataTypes.STRING, allowNull: false, unique: false},
    color:       {type: DataTypes.STRING,  allowNull: true,  unique: false}
  }, {
    classMethods: {
      associate(models) {
        Area.hasMany(models.Table,      {onDelete: 'RESTRICT'});
        Area.belongsToMany(models.User, {through: 'userarea', onDelete: 'RESTRICT'});
      }
    }
  });
  return Area;
};
