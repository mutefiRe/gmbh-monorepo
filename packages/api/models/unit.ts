"use strict";

module.exports = (sequelize, DataTypes) => {
  const Unit = sequelize.define("unit", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    eventId: { type: DataTypes.UUID, allowNull: true, unique: false },
    name: { type: DataTypes.STRING, allowNull: true, unique: false }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['eventId', 'name'],
        name: 'units_event_name_unique'
      }
    ]
  });

  // Add associations here if needed

  return Unit;
};
