"use strict";

module.exports = (sequelize, DataTypes) => {
  const Organization = sequelize.define("organization", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    uid: { type: DataTypes.STRING, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: false },
    street: { type: DataTypes.STRING, allowNull: true, unique: false },
    street_number: { type: DataTypes.STRING, allowNull: true, unique: false },
    postalcode: { type: DataTypes.STRING, allowNull: true, unique: false },
    city: { type: DataTypes.STRING, allowNull: true, unique: false },
    telephone: { type: DataTypes.STRING, allowNull: true, unique: false }
  });

  // Add associations here if needed

  return Organization;
};
