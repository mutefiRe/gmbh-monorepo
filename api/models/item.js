"use strict";

module.exports = function(sequelize, DataTypes) {
  let Item = sequelize.define("Item", {
    name: {type: DataTypes.STRING, allowNull: false,  unique: false},
    amount: {type: DataTypes.DECIMAL(10,2), allowNull: false,  unique: false},
    price: {type: DataTypes.DECIMAL(10,2), allowNull: false,  unique: false},
    tax: {type: DataTypes.DECIMAL(10,2), allowNull:false, unique:false}
  }, {
    classMethods: {
      associate: function(models) {
        Item.belongsTo(models.Unit)
        Item.belongsTo(models.Category)
      }
    }
  });
  Item.sync();

  return Item;
};
