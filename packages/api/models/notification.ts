"use strict";

module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define("notification", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    eventId: { type: DataTypes.UUID, allowNull: false, unique: false },
    entityType: { type: DataTypes.STRING, allowNull: false },
    entityId: { type: DataTypes.UUID, allowNull: true },
    action: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.STRING, allowNull: false },
    meta: { type: DataTypes.JSON, allowNull: true }
  });

  Notification.associate = (models) => {
    Notification.belongsTo(models.Event, { foreignKey: 'eventId', onDelete: 'CASCADE' });
  };

  return Notification;
};
