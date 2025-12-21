"use strict";
module.exports = (sequelize, DataTypes) => {
    const Setting = sequelize.define("setting", {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false, unique: false },
        beginDate: { type: DataTypes.DATE, allowNull: true, unique: false },
        endDate: { type: DataTypes.DATE, allowNull: true, unique: false },
        customTables: { type: DataTypes.BOOLEAN, allowNull: false, unique: false, defaultValue: false },
        instantPay: { type: DataTypes.BOOLEAN, allowNull: false, unique: false, defalutValue: true },
        showItemPrice: { type: DataTypes.BOOLEAN, allowNull: true, unique: false, defalutValue: true },
        expiresTime: { type: DataTypes.STRING, allowNull: false, unique: false, defaultValue: "168h" },
        activeEventId: { type: DataTypes.UUID, allowNull: true, unique: false }
    });
    Setting.associate = models => {
        Setting.belongsTo(models.Printer, { as: 'receiptPrinter' });
        Setting.belongsTo(models.Event, { as: 'activeEvent', foreignKey: 'activeEventId' });
    };
    return Setting;
};
