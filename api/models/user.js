"use strict";

const bcrypt = require("bcrypt");

module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define("user", {
    username:   {type: DataTypes.STRING,  allowNull: false, unique: true},
    firstname:  {type: DataTypes.STRING,  allowNull: true,  unique: false},
    lastname:   {type: DataTypes.STRING,  allowNull: true,  unique: false},
    password:   {type: DataTypes.STRING,  allowNull: false, unique: false},
    printer:    {type: DataTypes.STRING,  allowNull: true,  unique: false, defaultValue:null},
    permission: {type: DataTypes.INTEGER, allowNull: false, unique: false, validate: {isNumeric: true, min: 0, max: 2}}
  } , {
    instanceMethods: {
      validPassword(plaintext) {
        return bcrypt.compareSync(plaintext, this.password); // false
      }
    },
    classMethods: {
      generateHash(plaintext) {
        const salt = bcrypt.genSaltSync();
        return bcrypt.hashSync(plaintext, salt);
      },
      associate(models) {
        User.belongsToMany(models.Area, {through: 'userarea'});
      }
    }
  })

  User.hook('beforeValidate', function(user) {
    user.password = User.generateHash(user.password)
  })

  return User;
};

