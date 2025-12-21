"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = (sequelize, DataTypes) => {
    const Area = sequelize.define("area", {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        eventId: { type: DataTypes.UUID, allowNull: true, unique: false },
        name: { type: DataTypes.STRING, allowNull: false, unique: true },
        short: { type: DataTypes.STRING, allowNull: false, unique: true },
        enabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
        color: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: false,
            validate: { is: /^#([A-F0-9]{3}|[A-F0-9]{6})$/i },
            default: "#dddddd"
        }
    });
    Area.associate = models => {
        Area.hasMany(models.Table, { onDelete: 'NO ACTION' });
        Area.belongsToMany(models.User, { through: 'userarea', onDelete: 'NO ACTION' });
    };
    return Area;
};
