"use strict";

const db = require("../models/index");
const faker = require("faker2");

module.exports = async function () {
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

  await db.User.create({
    username: "admin",
    firstname: "Meister",
    lastname: "Lampe",
    password: "abc",
    role: "admin"
  });

  await db.User.create({
    username: "waiter",
    firstname: "die GmBh",
    lastname: " Buam",
    password: "abc",
    role: "waiter"
  });

  for (let i = 0; i < 20; i++) {
    await db.User.create({
      username: faker.Internet.userName(),
      firstname: faker.Name.firstName(),
      lastname: faker.Name.lastName(),
      password: "abc",
      role: faker.Helpers.randomize(["waiter", "admin"])
    });
  }

  /* FOOD */

  const cat = await db.Category.create({
    name: "Speisen",
    enabled: true,
    icon: "food",
    emoji: "🍽️",
    description: "Alle die Guten Sachen",
    showAmount: false,
    color: '#35063E'
  });
  const unit = await db.Unit.create({ name: "Stk." });
  for (let i = 0; i < 25; i++) {
    await db.Item.create({
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

  /* ORGANISATIONS */

  await db.Organization.create({
    uid: "blaaaah",
    name: "GehMalBierHolen Gmbh",
    street: "Urstein Süd",
    street_number: "1",
    postalcode: "5412",
    city: "Puch bei Hallein",
    telephone: "+43 650 12345678"
  });

  await db.Organization.create({
    uid: "puuuuh",
    name: "Fetzgeil Gmbh",
    street: "Urstein Nord",
    street_number: "3",
    postalcode: "5412",
    city: "Puch bei Hallein",
    telephone: "+43 650 87654321"
  });

  await db.Setting.create({
    name: "Testsetting",
    begin_date: "nodate",
    end_date: "nodate",
    instantPay: true,
    customTables: true,
    receiptPrinterId: null,
    expiresTime: "72h",
    showItemPrice: true
  });

  /* ALCOHOLICS */
  const alcCat = await db.Category.create({
    name: "Alkoholisches",
    enabled: true,
    icon: "drink-alc",
    emoji: "🍺",
    description: "alkohol",
    showAmount: true,
    color: '#FEAD00'
  });
  let [lUnit] = await db.Unit.findOrCreate({ where: { name: "l" } });
  await db.Item.bulkCreate([
    { name: "Bier", amount: 0.5, price: 3.5, tax: 0.2, unitId: lUnit.id, categoryId: alcCat.id },
    { name: "Bier", amount: 0.33, price: 2.5, tax: 0.2, unitId: lUnit.id, categoryId: alcCat.id },
    { name: "Radler", amount: 0.5, price: 2.5, tax: 0.2, unitId: lUnit.id, categoryId: alcCat.id },
    { name: "Radler", amount: 0.3, price: 2.5, tax: 0.2, unitId: lUnit.id, categoryId: alcCat.id },
    { name: "Grüner Veltliner", amount: 0.125, price: 3.5, tax: 0.2, unitId: lUnit.id, categoryId: alcCat.id },
    { name: "Grüner Veltliner", amount: 0.25, price: 5, tax: 0.2, unitId: lUnit.id, categoryId: alcCat.id },
    { name: "Spätburgunder", amount: 0.125, price: 3.5, tax: 0.2, unitId: lUnit.id, categoryId: alcCat.id },
    { name: "Spätburgunder", amount: 0.25, price: 5, tax: 0.2, unitId: lUnit.id, categoryId: alcCat.id },
    { name: "Weißer Spritzer", amount: 0.5, price: 3.5, tax: 0.2, unitId: lUnit.id, categoryId: alcCat.id },
    { name: "Roter Spritzer", amount: 0.5, price: 3.5, tax: 0.2, unitId: lUnit.id, categoryId: alcCat.id }
  ]);
  let [clUnit] = await db.Unit.findOrCreate({ where: { name: "cl" } });
  await db.Item.bulkCreate([
    { name: "Klopfer", amount: 2, price: 2.5, tax: 0.2, unitId: clUnit.id, categoryId: alcCat.id },
    { name: "Jägermeister", amount: 2, price: 2.5, tax: 0.2, unitId: clUnit.id, categoryId: alcCat.id },
    { name: "Obstler", amount: 4, price: 2, tax: 0.2, unitId: clUnit.id, categoryId: alcCat.id },
    { name: "Williams-Schnaps", amount: 4, price: 2, tax: 0.2, unitId: clUnit.id, categoryId: alcCat.id },
    { name: "Nuss-Schnaps", amount: 4, price: 2, tax: 0.2, unitId: clUnit.id, categoryId: alcCat.id }
  ]);

  /* NONALCOHOLICS */

  const coffeeCat = await db.Category.create({
    name: "Kaffee",
    enabled: true,
    icon: "drink-coffee",
    emoji: "☕",
    description: "Kaffee",
    showAmount: false,
    color: '#573200'
  });
  let [stkUnit] = await db.Unit.findOrCreate({ where: { name: "Stk." } });
  await db.Item.bulkCreate(
    kaffee.map(x => ({
      name: x,
      amount: 1,
      price: (Math.round(Math.random() * 20 * 10) / 10).toFixed(2),
      tax: 0.2,
      unitId: stkUnit.id,
      categoryId: coffeeCat.id
    }))
  );

  const dessertCat = await db.Category.create({
    name: "Dessert",
    enabled: true,
    icon: "desserts",
    emoji: "🍰",
    description: "Dessert",
    showAmount: false,
    color: '#B80C41'
  });
  let [stkUnit2] = await db.Unit.findOrCreate({ where: { name: "Stk." } });
  await db.Item.bulkCreate(
    dessert.map(x => ({
      name: x,
      amount: 1,
      price: (Math.round(Math.random() * 20 * 10) / 10).toFixed(2),
      tax: 0.2,
      unitId: stkUnit2.id,
      categoryId: dessertCat.id
    }))
  );


  const nonAlcCat = await db.Category.create({
    name: "Alkoholfreies",
    enabled: true,
    icon: "drink-anti",
    emoji: "🥤",
    description: "Alkoholfreies",
    showAmount: true,
    color: '#005213'
  });
  let [lUnit2] = await db.Unit.findOrCreate({ where: { name: "l" } });
  await db.Item.bulkCreate([
    { name: "Coca Cola", amount: 0.3, price: 2.5, tax: 0.2, unitId: lUnit2.id, categoryId: nonAlcCat.id },
    { name: "Coca Cola", amount: 0.5, price: 3.5, tax: 0.2, unitId: lUnit2.id, categoryId: nonAlcCat.id },
    { name: "Fanta", amount: 0.3, price: 2.5, tax: 0.2, unitId: lUnit2.id, categoryId: nonAlcCat.id },
    { name: "Fanta", amount: 0.5, price: 3.5, tax: 0.2, unitId: lUnit2.id, categoryId: nonAlcCat.id },
    { name: "Sprite", amount: 0.3, price: 2.5, tax: 0.2, unitId: lUnit2.id, categoryId: nonAlcCat.id },
    { name: "Sprite", amount: 0.5, price: 3.5, tax: 0.2, unitId: lUnit2.id, categoryId: nonAlcCat.id },
    { name: "Mineral", amount: 0.3, price: 2, tax: 0.2, unitId: lUnit2.id, categoryId: nonAlcCat.id },
    { name: "Mineral", amount: 0.5, price: 3, tax: 0.2, unitId: lUnit2.id, categoryId: nonAlcCat.id }
  ]);

  let [terrace] = await db.Area.findOrCreate({ where: { name: "Terrasse", color: '#2acb54', short: "T" } });
  for (let i = 0; i < 12; i++) {
    await db.Table.create({
      name: i,
      x: 1,
      y: 2,
      areaId: terrace.id
    });
  }

  let [gaststube] = await db.Area.findOrCreate({ where: { name: "Gaststube", color: '#45b1a4', short: "G" } });
  for (let i = 0; i < 12; i++) {
    await db.Table.create({
      name: i,
      x: 1,
      y: 2,
      areaId: gaststube.id
    });
  }
};
