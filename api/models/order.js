"use strict";

module.exports = function(sequelize, DataTypes) {
  let Order = sequelize.define("Order", {

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
