"use strict";
module.exports = (sequelize, DataTypes) => {
    const Unit = sequelize.define("unit", {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        eventId: { type: DataTypes.UUID, allowNull: true, unique: false },
        name: { type: DataTypes.STRING, allowNull: true, unique: true }
    });
    // Add associations here if needed
    return Unit;
};
