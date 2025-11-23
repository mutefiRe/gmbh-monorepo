"use strict";

module.exports = (sequelize, DataTypes) => {
  const Orderitem = sequelize.define("orderitem", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    extras: { type: DataTypes.STRING, allowNull: true, unique: false },
    count: { type: DataTypes.INTEGER, allowNull: false, unique: false, defaultValue: 1 },
    countFree: { type: DataTypes.INTEGER, allowNull: false, unique: false, defaultValue: 0 },
    countPaid: { type: DataTypes.INTEGER, allowNull: false, unique: false, defaultValue: 0 },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
  });

  Orderitem.associate = models => {
    Orderitem.belongsTo(models.Order, { onDelete: 'NO ACTION' });
    Orderitem.belongsTo(models.Item, { onDelete: 'NO ACTION' });
  };

  return Orderitem;
};
