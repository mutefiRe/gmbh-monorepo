"use strict";
module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define("order", {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        eventId: { type: DataTypes.UUID, allowNull: true, unique: false },
        number: { type: DataTypes.INTEGER, autoIncrement: true, unique: true },
        totalAmount: { type: DataTypes.DOUBLE, allowNull: false, unique: false, defaultValue: 0 }
    });
    Order.associate = models => {
        Order.belongsTo(models.User, { onDelete: 'NO ACTION' });
        Order.belongsTo(models.Table, { onDelete: 'NO ACTION' });
        Order.hasMany(models.Orderitem, { onDelete: 'NO ACTION' });
    };
    return Order;
};
