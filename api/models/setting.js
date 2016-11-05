"use strict";

module.exports = function(sequelize, DataTypes) {
  const Setting = sequelize.define("setting", {
    name:       {type: DataTypes.STRING,  allowNull: false,  unique: false},
    beginDate:  {type: DataTypes.DATE,    allowNull: true,   unique: false},
    endDate:    {type: DataTypes.DATE,    allowNull: true,   unique: false},
    instantPay: {type: DataTypes.BOOLEAN, allowNull: false,  unique: false, defaultValue: true }
  });
  return Setting;
};

