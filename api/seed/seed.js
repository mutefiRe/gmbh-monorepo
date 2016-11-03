'use strict'

const db = require('../models/index');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js')
const faker = require('faker2');

module.exports = function(){
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

  /*USER*/

  db.User.create({
    username: "admin",
    firstname: "Meister",
    lastname: "Lampe",
    password: "abc",
    permission: 0
  });
  db.User.create({
    username: "waiter",
    firstname: "die GmBh",
    lastname: " Buam",
    password: "abc",
    permission: 1
  });

  for(let i = 0; i < 50; i++){
    db.User.create({
      username: faker.Internet.userName(),
      firstname: faker.Name.firstName(),
      lastname: faker.Name.lastName(),
      password: "abc",
      permission: faker.Helpers.randomNumber(2)
    });
  }

  /*FOOD*/

  db.Category.create({
    name: "Speisen",
    enabled: true,
    icon: "food.svg",
    description: "Alle die Guten Sachen",
    showAmount: false,
    printer: "GMBH-WLAN"
  }).then(cat => {

    let stk = db.Unit.create({
      name: "Stk."
    }).then(data => {
      for(let i = 0; i < 25; i++){
        db.Item.create({
          name: faker.Helpers.randomize(speisen) + " "+ faker.Helpers.randomize(stopwords)+" " + faker.Helpers.randomize(beilagen),
          amount: 1,
          price: faker.Helpers.randomNumber(20),
          tax: 0.1,
          unitId: data.id,
          categoryId: cat.id
        })
      }
    });
  });

  /*ORGANISATIONS*/

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
    name: "Testsetting",
    begin_date: "nodate",
    end_date: "nodate",
    instantPay: true
  });

  /*ALCOHOLICS*/

  db.Category.create({
    name: "Alkoholisches",
    enabled: true,
    icon: "drink-alc.svg",
    description: "alkohol",
    showAmount: true,
    printer: "GMBH-LAN"
  }).then(cat => {
    db.Unit.findOrCreate({
      where: {name: 'l'}
    }).spread(data => {
      db.Item.bulkCreate([{
        name: "Bier",
        amount: 0.5,
        price: 3.5,
        tax: 0.2,
        unitId: data.id,
        categoryId: cat.id
      },{
        name: "Bier",
        amount: 0.33,
        price: 2.5,
        tax: 0.2,
        unitId: data.id,
        categoryId: cat.id
      },{
        name: "Radler",
        amount: 0.5,
        price: 2.5,
        tax: 0.2,
        unitId: data.id,
        categoryId: cat.id
      },{
        name: "Radler",
        amount: 0.3,
        price: 2.5,
        tax: 0.2,
        unitId: data.id,
        categoryId: cat.id
      },{
        name: "Grüner Veltliner",
        amount: 0.125,
        price: 3.5,
        tax: 0.2,
        unitId: data.id,
        categoryId: cat.id
      },{
        name: "Grüner Veltliner",
        amount: 0.25,
        price: 5,
        tax: 0.2,
        unitId: data.id,
        categoryId: cat.id
      },{
        name: "Spätburgunder",
        amount: 0.125,
        price: 3.5,
        tax: 0.2,
        unitId: data.id,
        categoryId: cat.id
      },{
        name: "Spätburgunder",
        amount: 0.25,
        price: 5,
        tax: 0.2,
        unitId: data.id,
        categoryId: cat.id
      },{
        name: "Weißer Spritzer",
        amount: 0.5,
        price: 3.5,
        tax: 0.2,
        unitId: data.id,
        categoryId: cat.id
      },{
        name: "Roter Spritzer",
        amount: 0.5,
        price: 3.5,
        tax: 0.2,
        unitId: data.id,
        categoryId: cat.id
      }]
      )
    })
    db.Unit.findOrCreate({
      where: {name: 'cl'}
    }).spread(data => {
      db.Item.bulkCreate([{
        name: "Klopfer",
        amount: 2,
        price: 2.5,
        tax: 0.2,
        unitId: data.id,
        categoryId: cat.id
      },{
        name: "Jägermeister",
        amount: 2,
        price: 2.5,
        tax: 0.2,
        unitId: data.id,
        categoryId: cat.id
      },{
        name: "Obstler",
        amount: 4,
        price: 2,
        tax: 0.2,
        unitId: data.id,
        categoryId: cat.id
      },{
        name: "Williams-Schnaps",
        amount: 4,
        price: 2,
        tax: 0.2,
        unitId: data.id,
        categoryId: cat.id
      },{
        name: "Nuss-Schnaps",
        amount: 4,
        price: 2,
        tax: 0.2,
        unitId: data.id,
        categoryId: cat.id
      }]
      )
    });
  });

  /*NONALCOHOLICS*/

  db.Category.create({
    name: "Alkoholfreies",
    enabled: true,
    icon: "drink-anti.svg",
    description: "Alkoholfreies",
    showAmount: true,
    printer: "GMBH-LAN"
  }).then(cat => {
    db.Unit.findOrCreate({
      where: {name: 'l'}
    }).spread(data => {
      db.Item.bulkCreate([{
        name: "Coca Cola",
        amount: 0.3,
        price: 2.5,
        tax: 0.2,
        unitId: data.id,
        categoryId: cat.id
      },{
        name: "Coca Cola",
        amount: 0.5,
        price: 3.5,
        tax: 0.2,
        unitId: data.id,
        categoryId: cat.id
      },{
        name: "Fanta",
        amount: 0.3,
        price: 2.5,
        tax: 0.2,
        unitId: data.id,
        categoryId: cat.id
      },{
        name: "Fanta",
        amount: 0.5,
        price: 3.5,
        tax: 0.2,
        unitId: data.id,
        categoryId: cat.id
      },{
        name: "Sprite",
        amount: 0.3,
        price: 2.5,
        tax: 0.2,
        unitId: data.id,
        categoryId: cat.id
      },{
        name: "Sprite",
        amount: 0.5,
        price: 3.5,
        tax: 0.2,
        unitId: data.id,
        categoryId: cat.id
      },{
        name: "Mineral",
        amount: 0.3,
        price: 2,
        tax: 0.2,
        unitId: data.id,
        categoryId: cat.id
      },{
        name: "Mineral",
        amount: 0.5,
        price: 3,
        tax: 0.2,
        unitId: data.id,
        categoryId: cat.id
      }]
      )
    });
  });


  db.Area.findOrCreate({
    where: {name: 'Terrasse'}
  }).spread(area => {
    for(let i = 0; i < 12; i++){
      db.Table.create({
        name:"T"+i,
        x: 1,
        y: 2,
        areaId: area.id
      })
    }
  });

  db.Area.findOrCreate({
    where: {name: 'Gaststube'}
  }).spread(area => {
    for(let i = 0; i < 12; i++){
      db.Table.create({
        name:"G"+i,
        x: 1,
        y: 2,
        areaId: area.id
      })
    }
  });
}

