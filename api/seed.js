'use strict'

const db = require('./models/index');
const jwt = require('jsonwebtoken');
const config = require('./config/config.js')


var user = db.User.create({
      username: "testUser",
      firstname: "max",
      lastname: "mustermann",
      password: "testPW",
      permission: 1,
      token: "abc123"
}).then(thisUser=>{
let token = jwt.sign(thisUser.dataValues, config.secret);
thisUser.update({
    token: token
  })
})



user = db.User.create({
      username: "admin",
      firstname: "max",
      lastname: "mustermann",
      password: "admin",
      permission: 1,
      token: "abc123"
}).then(thisUser=>{
let token = jwt.sign(thisUser.dataValues, config.secret);
thisUser.update({
    token: token
  })
})


user = db.User.create({
      username: "sebastian",
      firstname: "Sebastian",
      lastname: "Huber",
      password: "123",
      permission: 1,
      token: "abc1"
}).then(thisUser=>{
let token = jwt.sign(thisUser.dataValues, config.secret);
thisUser.update({
    token: token
  })
})


user = db.User.create({
      username: "konrad",
      firstname: "Konrad",
      lastname: "Kleeberger",
      password: "123",
      permission: 1,
      token: "abc2"
}).then(thisUser=>{
let token = jwt.sign(thisUser.dataValues, config.secret);
thisUser.update({
    token: token
  })
})


user = db.User.create({
      username: "josef",
      firstname: "Josef",
      lastname: "Krabath",
      password: "123",
      permission: 1,
      token: "abc3"
}).then(thisUser=>{
let token = jwt.sign(thisUser.dataValues, config.secret);
thisUser.update({
    token: token
  })
})


user = db.User.create({
      username: "daniel",
      firstname: "Daniel",
      lastname: "Trojer",
      password: "123",
      permission: 1,
      token: "abc4"
}).then(thisUser=>{
let token = jwt.sign(thisUser.dataValues, config.secret);
thisUser.update({
    token: token
  })
})


user = db.User.create({
      username: "alexander",
      firstname: "Alexander",
      lastname: "Gabriel",
      password: "123",
      permission: 1,
      token: "abc5"
}).then(thisUser=>{
let token = jwt.sign(thisUser.dataValues, config.secret);
thisUser.update({
    token: token
  })
})

//var userArray = [];


/*
db.Organization.create({
  uid: "",
  name: {type: DataTypes.STRING, allowNull: true,  unique: false},
  street: {type: DataTypes.STRING, allowNull: true,  unique: false},
  street_number: {type: DataTypes.STRING, allowNull: true,  unique: false},
  postalcode: {type: DataTypes.STRING, allowNull: true, unique: false},
  city: {type: DataTypes.STRING, allowNull: true, unique: false},
  telephone: {type: DataTypes.STRING, allowNull: true, unique: false}
})
*/
