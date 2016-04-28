'use strict'

const db = require('../models/index');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js')


var user = db.User.create({
      username: "testUser",
      firstname: "max",
      lastname: "mustermann",
      password: "testPW",
      permission: 3,
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
      permission: 2,
      token: "abc1234"
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



db.Organization.create({
  uid: "blaaaah",
  name: "GehMalBierHolen Gmbh",
  street: "Urstein Süd",
  street_number: "1",
  postalcode: "5412",
  city: "Puch bei Hallein",
  telephone: "+43 650 12345678"
})


db.Organization.create({
  uid: "puuuuh",
  name: "Fetzgeil Gmbh",
  street: "Urstein Nord",
  street_number: "3",
  postalcode: "5412",
  city: "Puch bei Hallein",
  telephone: "+43 650 87654321"
})

db.Setting.create({
  name: "Zeltfest volle saufen",
  begin_date: "nodate",
  end_date: "nodate"
})


db.Unit.create({

})
