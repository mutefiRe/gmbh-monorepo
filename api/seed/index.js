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
})

user = db.User.create({
  username: "admin",
  firstname: "max",
  lastname: "mustermann",
  password: "admin",
  permission: 2,
  token: "abc1234"
})

user = db.User.create({
  username: "sebastian",
  firstname: "Sebastian",
  lastname: "Huber",
  password: "123",
  permission: 1,
  token: "abc1"
})


user = db.User.create({
  username: "konrad",
  firstname: "Konrad",
  lastname: "Kleeberger",
  password: "123",
  permission: 1,
  token: "abc2"
})


user = db.User.create({
  username: "josef",
  firstname: "Josef",
  lastname: "Krabath",
  password: "123",
  permission: 1,
  token: "abc3"
})


user = db.User.create({
  username: "daniel",
  firstname: "Daniel",
  lastname: "Trojer",
  password: "123",
  permission: 1,
  token: "abc4"
})


user = db.User.create({
  username: "alexander",
  firstname: "Alexander",
  lastname: "Gabriel",
  password: "123",
  permission: 1,
  token: "abc5"
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


var essen = db.Category.create({
  name: "essen",
  enabled: true,
  description: "esssen essen essen",
}).then(cat => {

  var stk = db.Unit.create({
    name: "Stk."
  }).then(data => {
    db.Item.bulkCreate([{
      name: "Schnitzel mit Pommes",
      amount: 1,
      price: 8.5,
      tax: 0.1,
      UnitId: data.id,
      CategoryId: cat.id
    },{
      name: "Schnitzel mit Kartoffelsalat",
      amount: 1,
      price: 8.5,
      tax: 0.1,
      UnitId: data.id,
      CategoryId: cat.id
    },{
      name: "Käsekrainer mit Semmel",
      amount: 1,
      price: 8.5,
      tax: 0.1,
      UnitId: data.id,
      CategoryId: cat.id
    }]
    )
  })
})



var drinks = db.Category.create({
  name: "alk",
  enabled: true,
  description: "alkohol",
}).then(cat => {
  var l = db.Unit.create({
    name: "l"
  }).then(data => {
    db.Item.bulkCreate([{
      name: "Bier",
      amount: 0.5,
      price: 3.5,
      tax: 0.2,
      UnitId: data.id,
      CategoryId: cat.id
    },{
      name: "Radler",
      amount: 0.33,
      price: 2.5,
      tax: 0.2,
      UnitId: data.id,
      CategoryId: cat.id
    },{
      name: "Bier",
      amount: 0.5,
      price: 2.5,
      tax: 0.2,
      UnitId: data.id,
      CategoryId: cat.id
    }]
    )
  })
})

var noalk = db.Category.create({
  name: "alk",
  enabled: true,
  description: "alkohol",
}).then(cat => {

  var cl = db.Unit.create({
    name: "cl"
  }).then(data => {
    db.Item.bulkCreate([{
      name: "Klopfer",
      amount: 2,
      price: 2.5,
      tax: 0.2,
      UnitId: data.id,
      CategoryId: cat.id
    },{
      name: "Jägermeister",
      amount: 2,
      price: 2.5,
      tax: 0.2,
      UnitId: data.id,
      CategoryId: cat.id
    },{
      name: "Obstler",
      amount: 4,
      price: 2,
      tax: 0.2,
      UnitId: data.id,
      CategoryId: cat.id
    }]
    )
  })


})







