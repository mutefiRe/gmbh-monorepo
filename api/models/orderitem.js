"use strict";

module.exports = function(sequelize, DataTypes) {
  const Orderitem = sequelize.define("orderitem", {
    extras:  {type: DataTypes.STRING,  allowNull: true,  unique: false},
    isPaid:  {type: DataTypes.BOOLEAN, allowNull: false, unique: false, defaultValue:false },
    forFree: {type: DataTypes.BOOLEAN, allowNull: false, unique: false, defaultValue:false }
  }, {
    classMethods: {
      associate(models) {
        Orderitem.belongsTo(models.Order, {onDelete: 'RESTRICT'});
        Orderitem.belongsTo(models.Item,  {onDelete: 'RESTRICT'});
      }
    }
  });
  return Orderitem;
};
