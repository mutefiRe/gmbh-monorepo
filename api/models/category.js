"use strict";

module.exports = function(sequelize, DataTypes) {
  const Category = sequelize.define("category", {
    id:          {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
    name:        {type: DataTypes.STRING,  allowNull: false, unique: false},
    enabled:     {type: DataTypes.BOOLEAN, allowNull: false, unique: false},
    description: {type: DataTypes.STRING,  allowNull: false, unique: false},
    icon:        {type: DataTypes.STRING,  allowNull: true,  unique: false},
    showAmount:  {type: DataTypes.BOOLEAN, allowNull: true,  unique: false},
    printer:     {type: DataTypes.STRING,  allowNull: true,  unique: false},
    color:       {type: DataTypes.STRING,  allowNull: true,  unique: false}
  }, {
    classMethods: {
      associate(models) {
        Category.hasMany(models.Category,   { as: 'children', foreignKey: "categoryId" });
        Category.hasMany(models.Item,       { onDelete: 'RESTRICT'});
        Category.belongsTo(models.Category, { as: 'father', foreignKey: "categoryId" });
      }
    }
  });
  return Category;
};
