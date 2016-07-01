"use strict";

module.exports = function(sequelize, DataTypes) {
  let Orderitem = sequelize.define("Orderitem", {
    extras: {type: DataTypes.STRING, allowNull: true,  unique: false},
    isPaid: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue:false,  unique: false}
  }, {
    classMethods: {
      associate: function(models) {
        Orderitem.belongsTo(models.Order, {onDelete: 'RESTRICT'});
        Orderitem.belongsTo(models.Item, {onDelete: 'RESTRICT'})
      }
    }
  });
  return Orderitem;
};
