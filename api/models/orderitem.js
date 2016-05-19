"use strict";

module.exports = function(sequelize, DataTypes) {
  let Orderitem = sequelize.define("Orderitem", {
    extras: {type: DataTypes.STRING, allowNull: false,  unique: false},
    isPaid: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue:false,  unique: false}
  }, {
    classMethods: {
      associate: function(models) {
        Orderitem.belongsTo(models.Order);
        Orderitem.belongsTo(models.Item)
      }
    }
  });
  return Orderitem;
};
