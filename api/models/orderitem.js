"use strict";

module.exports = function(sequelize, DataTypes) {
  const Orderitem = sequelize.define("orderitem", {
    extras:    {type: DataTypes.STRING,        allowNull: true,  unique: false},
    count:     {type: DataTypes.INTEGER,       allowNull: false, unique: false, defaultValue:false },
    countFree: {type: DataTypes.INTEGER,       allowNull: false, unique: false, defaultValue: 0 },
    countPaid: {type: DataTypes.INTEGER,       allowNull: false, unique: false, defaultValue: 0 },
    price:     {type: DataTypes.DECIMAL(10,2), allowNull: false }
  }, {
    classMethods: {
      associate(models) {
        Orderitem.belongsTo(models.Order, {onDelete: 'RESTRICT'});
        Orderitem.belongsTo(models.Item,  {onDelete: 'RESTRICT'})
      }
    }
  });
  return Orderitem;
};
