"use strict";

module.exports = function(sequelize, DataTypes) {
  const Item = sequelize.define("item", {
    id:     {type: DataTypes.UUID,          defaultValue: DataTypes.UUIDV4, primaryKey: true},
    name:   {type: DataTypes.STRING,        allowNull: false,  unique: false},
    amount: {type: DataTypes.DECIMAL(10,3), allowNull: false,  unique: false},
    price:  {type: DataTypes.DECIMAL(10,2), allowNull: false,  unique: false},
    tax:    {type: DataTypes.DECIMAL(10,2), allowNull:false,   unique:false},
    sort:   {type: DataTypes.INTEGER,       allowNull:true,    unique:false}
  }, {
    classMethods: {
      associate(models) {
        Item.belongsTo(models.Unit, {onDelete: 'RESTRICT'});
        Item.belongsTo(models.Category, {onDelete: 'RESTRICT'});
      }
    }
  });

  return Item;
};
