"use strict";

module.exports = function(sequelize, DataTypes) {
  let Category = sequelize.define("Category", {
    name: {type: DataTypes.STRING, allowNull: false,  unique: false},
    enabled: {type: DataTypes.BOOLEAN, allowNull: false,  unique: false},
    description: {type: DataTypes.STRING, allowNull: false, unique: false},
    icon: {type: DataTypes.STRING, allowNull: true, unique: false},
    showAmount: {type:DataTypes.BOOLEAN, allowNull: true, unique: false}
  }, {
    classMethods: {
      associate: function(models) {
        Category.hasMany(models.Category, { as: 'children', foreignKey: "CategoryId" });
        Category.hasMany(models.Item)
        Category.belongsTo(models.Category, { as: 'father', foreignKey: "CategoryId" });
      }
    }
  });
  return Category;
};

