"use strict";

const bcrypt = require("bcrypt");

module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define("user", {
    id:         {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
    username:   {type: DataTypes.STRING,  allowNull: false, unique: true},
    firstname:  {type: DataTypes.STRING,  allowNull: true,  unique: false},
    lastname:   {type: DataTypes.STRING,  allowNull: true,  unique: false},
    password:   {type: DataTypes.STRING,  allowNull: false, unique: false},
    role:       {type: DataTypes.ENUM,    allowNull: false, unique: false, values: ['admin', 'waiter']}
  } , {
    instanceMethods: {
      validPassword(plaintext) {
        return bcrypt.compareSync(plaintext, this.password);
      },
      createAuthUser(){
        return {
          "id":         this.id,
          "username":   this.username,
          "role":       this.role,
          "firstname":  this.firstname,
          "lastname":   this.lastname
        };
      }
    },
    classMethods: {
      generateHash(plaintext) {
        const salt = bcrypt.genSaltSync();
        return bcrypt.hashSync(plaintext, salt);
      },
      associate(models) {
        User.belongsToMany(models.Area, {through: 'userarea'});
        User.belongsTo(models.Printer);
      }
    }
  });

  User.hook('beforeValidate', function(user) {
    user.password = User.generateHash(user.password);
  });

  return User;
};

