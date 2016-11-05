"use strict";

module.exports = function(sequelize, DataTypes) {
  const Order = sequelize.define("order", {
    totalAmount: {type: DataTypes.DOUBLE,  allowNull: false, unique: false},
    isPaid:      {type: DataTypes.BOOLEAN, allowNull: false, unique: false, defaultValue:false}
  }, {
    classMethods: {
      associate(models) {
        Order.belongsTo(models.User,    {onDelete: 'RESTRICT'});
        Order.belongsTo(models.Table,   {onDelete: 'RESTRICT'});
        Order.hasMany(models.Orderitem, {onDelete: 'RESTRICT'});
      }
    }
  });
  return Order;
};
