"use strict";

module.exports = function(sequelize, DataTypes) {
  const Order = sequelize.define("order", {
    totalAmount: {type: DataTypes.DOUBLE,  allowNull: false, unique: false, defaultValue: 0}
  }, {
    classMethods: {
      associate(models) {
        Order.belongsTo(models.User,    {onDelete: 'NO ACTION'});
        Order.belongsTo(models.Table,   {onDelete: 'NO ACTION'});
        Order.hasMany(models.Orderitem, {onDelete: 'NO ACTION'});
      }
    }
  });
  return Order;
};
