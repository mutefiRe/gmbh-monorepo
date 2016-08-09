"use strict";

const bcrypt = require("bcrypt");


module.exports = function(sequelize, DataTypes) {
  let User = sequelize.define("User", {
    username: {type: DataTypes.STRING, allowNull: false,  unique: true},
    firstname: {type: DataTypes.STRING, allowNull: true,  unique: false},
    lastname: {type: DataTypes.STRING, allowNull: true,  unique: false},
    password: {type: DataTypes.STRING, allowNull: false,  unique: false},
    printer: {type:DataTypes.STRING, allowNull: true, unique: false, defaultValue:null},
    permission: {type: DataTypes.INTEGER, allowNull:false, unique: false, validate: {isNumeric: true, min: 0, max: 2}}
  } , {
    instanceMethods: {
      validPassword: function(plaintext) {
        return bcrypt.compareSync(plaintext, this.password); // false
      }
    },
    classMethods: {
      generateHash: function(plaintext) {
        let salt = bcrypt.genSaltSync();
        let hash = bcrypt.hashSync(plaintext, salt);
        return hash
      },
      associate: function(models) {
        User.belongsToMany(models.Area, {through: 'UserArea'});
      }
    }
  })


  User.hook('beforeValidate', function(user, options) {
    user.password = User.generateHash(user.password)
  })

  return User;
};

