"use strict";

module.exports = function(sequelize, DataTypes) {
  let Item = sequelize.define("Item", {
    name: {type: DataTypes.STRING, allowNull: false,  unique: true},
    amount: {type: DataTypes.DECIMAL(2), allowNull: false,  unique: false},
    unit: {type: DataTypes.STRING, allowNull: false,  unique: false},
    price: {type: DataTypes.DECIMAL(2), allowNull: false,  unique: false},
    tax: {type: DataTypes.DECIMAL(2), allowNull:false, unique:false}
  }, {
    classMethods: {
      associate: function(models) {
        Item.hasOne(models.Unit)
      }
    }
  });
  Item.sync();

  return Item;
};
