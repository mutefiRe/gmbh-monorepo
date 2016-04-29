"use strict";

module.exports = function(sequelize, DataTypes) {
  let User = sequelize.define("User", {
    username: {type: DataTypes.STRING, allowNull: false,  unique: true},
    firstname: {type: DataTypes.STRING, allowNull: true,  unique: false},
    lastname: {type: DataTypes.STRING, allowNull: true,  unique: false},
    password: {type: DataTypes.STRING, allowNull: false,  unique: false},
    permission: {type: DataTypes.INTEGER, allowNull:false, unique: false}
  })/* , {
    classMethods: {
     associate: function(models) {
        User.hasMany(models.User, {as: 'children', foreignKey: 'UserId'});
        User.belongsTo(models.User, {as: 'parent', foreignKey: 'UserId'});
      }

    }
  }*/
  return User;
};

