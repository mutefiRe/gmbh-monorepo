"use strict";

module.exports = function(sequelize, DataTypes) {
  let Category = sequelize.define("Category", {
    name: {type: DataTypes.STRING, allowNull: false,  unique: false},
    enabled: {type: DataTypes.BOOLEAN, allowNull: false,  unique: false},
    description: {type: DataTypes.STRING, allowNull: false, unique: false},
    color: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      validate: {
        is: /^(#[a-f0-9]{6}|#[a-f0-9]{3}|rgb *\( *[0-9]{1,3}%? *, *[0-9]{1,3}%? *, *[0-9]{1,3}%? *\)|rgba *\( *[0-9]{1,3}%? *, *[0-9]{1,3}%? *, *[0-9]{1,3}%? *, *[0-9]{1,3}%? *\)|black|green|silver|gray|olive|white|yellow|maroon|navy|red|blue|purple|teal|fuchsia|aqua)$/i
      }
    },
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

