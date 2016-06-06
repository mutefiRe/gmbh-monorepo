"use strict";

module.exports = function(sequelize, DataTypes) {
  let Order = sequelize.define("Order", {
    totalAmount: {type: DataTypes.INTEGER, allowNull: false,  unique: false},
    isPaid: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue:false,  unique: false}
  }, {
    classMethods: {
      associate: function(models) {
        Order.belongsTo(models.User);
        Order.belongsTo(models.Table);
        Order.hasMany(models.Orderitem);
      }
    }
  });
  return Order;
};
