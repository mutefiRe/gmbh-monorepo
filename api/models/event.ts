"use strict";

module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define("event", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: false },
    beginDate: { type: DataTypes.DATE, allowNull: true, unique: false },
    endDate: { type: DataTypes.DATE, allowNull: true, unique: false }
  });

  Event.associate = models => {
    Event.hasMany(models.Area, { foreignKey: 'eventId' });
    Event.hasMany(models.Category, { foreignKey: 'eventId' });
    Event.hasMany(models.Item, { foreignKey: 'eventId' });
    Event.hasMany(models.Unit, { foreignKey: 'eventId' });
    Event.hasMany(models.Table, { foreignKey: 'eventId' });
    Event.hasMany(models.Organization, { foreignKey: 'eventId' });
    Event.hasMany(models.Order, { foreignKey: 'eventId' });
  };

  return Event;
};
