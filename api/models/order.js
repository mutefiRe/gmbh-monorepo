"use strict";

module.exports = function(sequelize, DataTypes) {
  const Order = sequelize.define("order", {
    id:          {type: DataTypes.UUID,    defaultValue: DataTypes.UUIDV4, primaryKey: true},
    number:      {type: DataTypes.INTEGER, autoIncrement: true, unique:true},
    totalAmount: {type: DataTypes.DOUBLE,  allowNull: false,    unique: false, defaultValue: 0}
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
