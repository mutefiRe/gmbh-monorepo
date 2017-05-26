"use strict";

module.exports = function(sequelize, DataTypes) {
  const Item = sequelize.define("item", {
    id:      {type: DataTypes.UUID,          defaultValue: DataTypes.UUIDV4, primaryKey: true},
    name:    {type: DataTypes.STRING,        allowNull: false, unique: false},
    amount:  {type: DataTypes.DECIMAL(10,3), allowNull: false, unique: false},
    price:   {type: DataTypes.DECIMAL(10,2), allowNull: false, unique: false},
    tax:     {type: DataTypes.DECIMAL(10,2), allowNull: false, unique: false},
    group:   {type: DataTypes.INTEGER,       unique: false, defaultValue: 999},
    enabled: {type: DataTypes.BOOLEAN,       allowNull: false, defaultValue: true}
  }, {
    classMethods: {
      associate(models) {
        Item.belongsTo(models.Unit, {onDelete: 'NO ACTION'});
        Item.belongsTo(models.Category, {onDelete: 'NO ACTION'});
      }
    }
  });

  return Item;
};
