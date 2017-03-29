"use strict";

module.exports = function(sequelize, DataTypes) {
  const Setting = sequelize.define("setting", {
    id:             {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
    name:           {type: DataTypes.STRING,  allowNull: false, unique: false},
    beginDate:      {type: DataTypes.DATE,    allowNull: true,  unique: false},
    endDate:        {type: DataTypes.DATE,    allowNull: true,  unique: false},
    customTables:   {type: DataTypes.BOOLEAN, allowNull: false, unique: false, defaultValue: false },
    instantPay:     {type: DataTypes.BOOLEAN, allowNull: false, unique: false, defaultValue: true },
    receiptPrinter: {type: DataTypes.STRING,  allowNull: false, unique: false},
    eventName:      {type: DataTypes.STRING,  allowNull: false, unique: false},
    expiresTime:    {type: DataTypes.STRING,  allowNull: false, unique: false, defaultValue: "72h"}
  });
  return Setting;
};

