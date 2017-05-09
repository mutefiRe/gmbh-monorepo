"use strict";

module.exports = function(sequelize, DataTypes) {
  const Area  = sequelize.define("area", {
    id:      {type: DataTypes.UUID,    defaultValue: DataTypes.UUIDV4, primaryKey: true},
    name:    {type: DataTypes.STRING,  allowNull: false, unique: false},
    color:   {type: DataTypes.STRING,  allowNull: true,  unique: false},
    enabled: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true}
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
