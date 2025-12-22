"use strict";

module.exports = (sequelize, DataTypes) => {
  const Table = sequelize.define("table", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    eventId: { type: DataTypes.UUID, allowNull: true, unique: false },
    name: { type: DataTypes.STRING, allowNull: false, unique: false },
    x: { type: DataTypes.INTEGER, allowNull: true, unique: false },
    y: { type: DataTypes.INTEGER, allowNull: true, unique: false },
    custom: { type: DataTypes.BOOLEAN, allowNull: true, unique: false, defaultValue: false },
    enabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  });

  Table.associate = models => {
    Table.belongsTo(models.Area, { onDelete: 'NO ACTION' });
  };

  return Table;
};
