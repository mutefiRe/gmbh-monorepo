"use strict";

const db = require("../models/index");
const faker = require("faker2");

module.exports = function() {
  const speisen = [
    "Schnitzel",
    "Käsekrainer",
    "Schweinebraten",
    "Pommes",
    "Toast",
    "Waffeln",
    "Wurst",
    "Currywurst",
    "Hendl",
    "Frankfurter",
    "Gulasch",
    "Leberkassemmel",
    "Kartoffelpuffer",
    "Steak",
    "Bananenquiche",
    "Knödel"
  ];

  const stopwords = ["in", "an", "auf", "mit", "überbacken mit"];

  const beilagen = [
    "Salat",
    "Püree",
    "Kartoffel",
    "Reis",
    "Nudeln",
    "Bratgemüse",
    "Pumpernickel",
    "Frühlingsgemüse",
    "Brot",
    "Weißbrot",
    "Breze",
    "Rettich",
    "Sauerkraut",
    "Semmel",
    "Soße",
    "Himbeerspiegel",
    "Preiselbeeren",
    "Erdäpfelsalat",
    "Pommes"
  ];

  const kaffee = [
    "Espresso",
    "Doppelter-Espresso",
    "Caffe Latte",
    "Capuccino",
    "Mokkaccino",
    "Mokka Latte",
    "Verlängerter",
    "Chai Latte"
  ];

  const dessert = [
    "Schwarzwälder-Kirsch Torte",
    "Topfenstrudel",
    "Apfelstrudel",
    "Guglhupf",
    "Schokomouse",
    "Desserteis",
    "Birnenparfait",
    "Bananensplit",
    "Krokantbecher",
    "Heiße Liebe"
  ];

  /* USER */

  db.User.create({
    username: "admin",
    firstname: "Meister",
    lastname: "Lampe",
    password: "abc",
    role: "admin"
  });

  db.User.create({
    username: "waiter",
    firstname: "die GmBh",
    lastname: " Buam",
    password: "abc",
    role: "waiter"
  });

  for (let i = 0; i < 20; i++) {
    db.User.create({
      username: faker.Internet.userName(),
      firstname: faker.Name.firstName(),
      lastname: faker.Name.lastName(),
      password: "abc",
      role: faker.Helpers.randomize(["waiter", "admin"])
    });
  }

  /* FOOD */

  db.Category
    .create({
      name: "Speisen",
      enabled: true,
      icon: "food",
      description: "Alle die Guten Sachen",
      showAmount: false,
      color: '#35063E'
    })
    .then(cat => {
      db.Unit.create({
        name: "Stk."
      })
      .then(unit => {
        for (let i = 0; i < 25; i++) {
          db.Item.create({
            name: faker.Helpers.randomize(speisen) +
            " " +
            faker.Helpers.randomize(stopwords) +
            " " +
            faker.Helpers.randomize(beilagen),
            amount: 1,
            price: faker.Helpers.randomNumber(20) + 1,
            tax: 0.1,
            unitId: unit.id,
            categoryId: cat.id
          });
        }
      });
    });

  /* ORGANISATIONS */

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
    instantPay: true,
    customTables: true,
    receiptPrinterId: null,
    eventName: "GMBH",
    expiresTime: "72h",
    showItemPrice: true
  });

  /* ALCOHOLICS */
  db.Category.create({
    name: "Alkoholisches",
    enabled: true,
    icon: "drink-alc",
    description: "alkohol",
    showAmount: true,
    color: '#FEAD00'
  })
  .then(cat => {
    db.Unit.findOrCreate({
      where: { name: "l" }
    })
    .spread(unit => {
      db.Item.bulkCreate([
        {
          name: "Bier",
          amount: 0.5,
          price: 3.5,
          tax: 0.2,
          unitId: unit.id,
          categoryId: cat.id
        },
        {
          name: "Bier",
          amount: 0.33,
          price: 2.5,
          tax: 0.2,
          unitId: unit.id,
          categoryId: cat.id
        },
        {
          name: "Radler",
          amount: 0.5,
          price: 2.5,
          tax: 0.2,
          unitId: unit.id,
          categoryId: cat.id
        },
        {
          name: "Radler",
          amount: 0.3,
          price: 2.5,
          tax: 0.2,
          unitId: unit.id,
          categoryId: cat.id
        },
        {
          name: "Grüner Veltliner",
          amount: 0.125,
          price: 3.5,
          tax: 0.2,
          unitId: unit.id,
          categoryId: cat.id
        },
        {
          name: "Grüner Veltliner",
          amount: 0.25,
          price: 5,
          tax: 0.2,
          unitId: unit.id,
          categoryId: cat.id
        },
        {
          name: "Spätburgunder",
          amount: 0.125,
          price: 3.5,
          tax: 0.2,
          unitId: unit.id,
          categoryId: cat.id
        },
        {
          name: "Spätburgunder",
          amount: 0.25,
          price: 5,
          tax: 0.2,
          unitId: unit.id,
          categoryId: cat.id
        },
        {
          name: "Weißer Spritzer",
          amount: 0.5,
          price: 3.5,
          tax: 0.2,
          unitId: unit.id,
          categoryId: cat.id
        },
        {
          name: "Roter Spritzer",
          amount: 0.5,
          price: 3.5,
          tax: 0.2,
          unitId: unit.id,
          categoryId: cat.id
        }
      ]);
    });

    db.Unit.findOrCreate({
      where: { name: "cl" }
    })
    .spread(unit => {
      db.Item.bulkCreate([
        {
          name: "Klopfer",
          amount: 2,
          price: 2.5,
          tax: 0.2,
          unitId: unit.id,
          categoryId: cat.id
        },
        {
          name: "Jägermeister",
          amount: 2,
          price: 2.5,
          tax: 0.2,
          unitId: unit.id,
          categoryId: cat.id
        },
        {
          name: "Obstler",
          amount: 4,
          price: 2,
          tax: 0.2,
          unitId: unit.id,
          categoryId: cat.id
        },
        {
          name: "Williams-Schnaps",
          amount: 4,
          price: 2,
          tax: 0.2,
          unitId: unit.id,
          categoryId: cat.id
        },
        {
          name: "Nuss-Schnaps",
          amount: 4,
          price: 2,
          tax: 0.2,
          unitId: unit.id,
          categoryId: cat.id
        }
      ]);
    });
  });

  /* NONALCOHOLICS */

  db.Category.create({
    name: "Kaffee",
    enabled: true,
    icon: "drink-coffee",
    description: "Kaffee",
    showAmount: false,
    color: '#573200'
  })
  .then(cat => {
    db.Unit.findOrCreate({
      where: { name: "Stk." }
    })
    .spread(unit => {
      db.Item.bulkCreate(
        kaffee.map(x => {
          return {
            name: x,
            amount: 1,
            price: (Math.round(Math.random() * 20 * 10) / 10).toFixed(2),
            tax: 0.2,
            unitId: unit.id,
            categoryId: cat.id
          };
        })
      );
    });
  });

  db.Category.create({
    name: "Dessert",
    enabled: true,
    icon: "desserts",
    description: "Dessert",
    showAmount: false,
    color: '#B80C41'
  })
  .then(cat => {
    db.Unit.findOrCreate({
      where: { name: "Stk." }
    })
    .spread(unit => {
      db.Item.bulkCreate(
        dessert.map(x => {
          return {
            name: x,
            amount: 1,
            price: (Math.round(Math.random() * 20 * 10) / 10).toFixed(2),
            tax: 0.2,
            unitId: unit.id,
            categoryId: cat.id
          };
        })
      );
    });
  });


  db.Category.create({
    name: "Alkoholfreies",
    enabled: true,
    icon: "drink-anti",
    description: "Alkoholfreies",
    showAmount: true,
    color: '#005213'
  })
  .then(cat => {
    db.Unit.findOrCreate({
      where: { name: "l" }
    })
    .spread(unit => {
      db.Item.bulkCreate([
        {
          name: "Coca Cola",
          amount: 0.3,
          price: 2.5,
          tax: 0.2,
          unitId: unit.id,
          categoryId: cat.id
        },
        {
          name: "Coca Cola",
          amount: 0.5,
          price: 3.5,
          tax: 0.2,
          unitId: unit.id,
          categoryId: cat.id
        },
        {
          name: "Fanta",
          amount: 0.3,
          price: 2.5,
          tax: 0.2,
          unitId: unit.id,
          categoryId: cat.id
        },
        {
          name: "Fanta",
          amount: 0.5,
          price: 3.5,
          tax: 0.2,
          unitId: unit.id,
          categoryId: cat.id
        },
        {
          name: "Sprite",
          amount: 0.3,
          price: 2.5,
          tax: 0.2,
          unitId: unit.id,
          categoryId: cat.id
        },
        {
          name: "Sprite",
          amount: 0.5,
          price: 3.5,
          tax: 0.2,
          unitId: unit.id,
          categoryId: cat.id
        },
        {
          name: "Mineral",
          amount: 0.3,
          price: 2,
          tax: 0.2,
          unitId: unit.id,
          categoryId: cat.id
        },
        {
          name: "Mineral",
          amount: 0.5,
          price: 3,
          tax: 0.2,
          unitId: unit.id,
          categoryId: cat.id
        }
      ]);
    });
  });

  db.Area.findOrCreate({
    where: { name: "Terrasse", color: '#2acb54', short:"T" }
  })
  .spread(area => {
    for (let i = 0; i < 12; i++) {
      db.Table.create({
        name: i,
        x: 1,
        y: 2,
        areaId: area.id
      });
    }
  });

  db.Area.findOrCreate({
    where: { name: "Gaststube", color: '#45b1a4', short:"G" }
  })
  .spread(area => {
    for (let i = 0; i < 12; i++) {
      db.Table.create({
        name: i,
        x: 1,
        y: 2,
        areaId: area.id
      });
    }
  });
};
