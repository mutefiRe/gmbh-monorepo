'use strict'

const db = require('../models/index');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js')
const faker = require('faker2');

for(let i = 0; i < 100; i++){
  let user = db.User.create({
    username: faker.Internet.userName(),
    firstname: faker.Name.firstName(),
    lastname: faker.Name.lastName(),
    password: faker.Internet.domainWord() + faker.Helpers.randomNumber(999),
    permission: faker.Helpers.randomNumber(2)
  });
}

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


let essen = db.Category.create({
  name: "essen",
  enabled: true,
  description: "esssen essen essen",
}).then(cat => {

  let stk = db.Unit.create({
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



let drinks = db.Category.create({
  name: "alk",
  enabled: true,
  description: "alkohol",
}).then(cat => {
  let l = db.Unit.create({
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

let noalk = db.Category.create({
  name: "alk",
  enabled: true,
  description: "alkohol",
}).then(cat => {

  let cl = db.Unit.create({
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

let Area = db.Area.create({
  name: "Terrasse"
}).then(area => {
  let User = db.User.create({
    username: "areausertest",
    firstname: "Kellner1",
    lastname: "Carlos",
    password: "123",
    permission: 1
  }).then(user => {
    user.addArea(area);
  });
});







