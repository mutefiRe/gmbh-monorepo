"use strict";

module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define("category", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    eventId: { type: DataTypes.UUID, allowNull: true, unique: false },
    name: { type: DataTypes.STRING, allowNull: false, unique: false },
    enabled: { type: DataTypes.BOOLEAN, allowNull: false, unique: false, defaultValue: true },
    icon: { type: DataTypes.STRING, allowNull: true, unique: false },
    showAmount: { type: DataTypes.BOOLEAN, allowNull: true, unique: false },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
      validate: { is: /^#([A-F0-9]{3}|[A-F0-9]{6})$/i }
    },
    printerId: { type: DataTypes.UUID, allowNull: true, unique: false },
    categoryId: { type: DataTypes.UUID, allowNull: true, unique: false }
  });

  Category.associate = models => {
    Category.hasMany(models.Category, { as: 'children', foreignKey: "categoryId" });
    Category.hasMany(models.Item, { onDelete: 'NO ACTION' });
    Category.belongsTo(models.Printer, { as: 'printer', foreignKey: "printerId" });
    Category.belongsTo(models.Category, { as: 'father', foreignKey: "categoryId" });
  };

  return Category;
};
