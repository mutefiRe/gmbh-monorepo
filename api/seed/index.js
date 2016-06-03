'use strict'

const db = require('../models/index');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js')
const faker = require('faker2');

let speisen = [ 'Schnitzel',
'Käsekrainer',
'Schweinebraten',
'Pommes',
'Toast',
'Waffeln',
'Wurst',
'Currywurst',
'Hendl',
'Frankfurter',
'Gulasch',
'Leberkassemmel',
'Kartoffelpuffer',
'Steak',
'Bananenquiche',
'Knödel' ];

let stopwords = ['in','an','auf','mit', 'überbacken mit'];

let beilagen = [ 'Salat',
'Püree',
'Kartoffel',
'Reis',
'Nudeln',
'Bratgemüse',
'Pumpernickel',
'Frühlingsgemüse',
'Brot',
'Weißbrot',
'Breze',
'Rettich',
'Sauerkraut',
'Semmel',
'Soße',
'Himbeerspiegel',
'Preiselbeeren',
'Erdäpfelsalat',
'Pommes' ];


for(let i = 0; i < 50; i++){
  db.User.create({
    username: faker.Internet.userName(),
    firstname: faker.Name.firstName(),
    lastname: faker.Name.lastName(),
    password: "abc",
    permission: faker.Helpers.randomNumber(2)
  });
}

db.Category.create({
  name: "Speisen",
  enabled: true,
  icon: "food.svg",
  description: "Alle die Guten Sachen",
  showAmount: false
}).then(cat => {

  let stk = db.Unit.create({
    name: "Stk."
  }).then(data => {
    for(let i = 0; i < 150; i++){
      db.Item.create({
        name: faker.Helpers.randomize(speisen) + " "+ faker.Helpers.randomize(stopwords)+" " + faker.Helpers.randomize(beilagen),
        amount: 1,
        price: faker.Helpers.randomNumber(20),
        tax: 0.1,
        UnitId: data.id,
        CategoryId: cat.id
      })
    }
  });
});


db.Organization.create({
  uid: "blaaaah",
  name: "GehMalBierHolen Gmbh",
  street: "Urstein Süd",
  street_number: "1",
  postalcode: "5412",
  city: "Puch bei Hallein",
  telephone: "+43 650 12345678"
});

db.Organization.create({
  uid: "puuuuh",
  name: "Fetzgeil Gmbh",
  street: "Urstein Nord",
  street_number: "3",
  postalcode: "5412",
  city: "Puch bei Hallein",
  telephone: "+43 650 87654321"
});

db.Setting.create({
  name: "Zeltfest volle saufen",
  begin_date: "nodate",
  end_date: "nodate"
});






let drinks = db.Category.create({
  name: "Alkoholisches",
  enabled: true,
  icon: "drink-alc.svg",
  description: "alkohol",
  showAmount: true
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
});

let noalk = db.Category.create({
  name: "Alkoholfreies",
  enabled: true,
  icon: "drink-anti.svg",
  description: "Alkoholfreies",
  showAmount: true
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
  });
});


let Area = db.Area.create({
  name: "Terrasse"
}).then(area => {
 let Table = db.Table.create({
  name:"A1",
  x: 1,
  y: 2,
  AreaId:1
})
 Table = db.Table.create({
  name:"A2",
  x: 2,
  y: 3,
  AreaId:1
}).then(table => {

  let Order = db.Order.create({
    UserId: 1,
    TableId: 1
  }).then(order => {
    db.Orderitem.create({
      OrderId:order.id,
      ItemId:1
    }).then(orderitem => order.addOrderitem(orderitem))
    db.Orderitem.create({
      OrderId:order.id,
      ItemId:1
    }).then(orderitem => order.addOrderitem(orderitem))
  }
  )

})


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


