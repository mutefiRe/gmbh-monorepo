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

  /* PRINTER */

  await db.Printer.bulkCreate([
    { systemName: "GMBH", name: "Keller" },
    { systemName: "26:11:0E:86:70:5B" },
    { systemName: "00:5F:8D:65:85:06", name: "Küche" }
  ]);
  const printer = await db.Printer.findOne({ where: { systemName: "GMBH" } });
  const printerId = printer ? printer.id : null;
  const event = await db.Event.create({
    name: "Testevent",
    beginDate: null,
    endDate: null
  });
  const setting = await db.Setting.create({
    name: "Testsetting",
    begin_date: "nodate",
    end_date: "nodate",
    instantPay: true,
    customTables: true,
    expiresTime: "72h",
    showItemPrice: true,
    activeEventId: event.id
  });
  const eventId = event.id;

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
  for (let i = 0; i < 50; i++) {
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
    icon: "utensils",
    description: "Alle die Guten Sachen",
    showAmount: false,
    printerId,
    color: '#6366f1',
    eventId
  });
  const unit = await db.Unit.create({ name: "Stk.", eventId });
  for (let i = 0; i < 25; i++) {
    await db.Item.create({
      name: faker.Helpers.randomize(speisen) +
        " " +
        faker.Helpers.randomize(stopwords) +
        " " +
        faker.Helpers.randomize(beilagen),
      amount: 1,
      price: faker.Helpers.randomNumber(20) + 1,
      unitId: unit.id,
      categoryId: cat.id,
      eventId
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
    telephone: "+43 650 12345678",
    eventId
  });
  await db.Organization.create({
    uid: "puuuuh",
    name: "Fetzgeil Gmbh",
    street: "Urstein Nord",
    street_number: "3",
    postalcode: "5412",
    city: "Puch bei Hallein",
    telephone: "+43 650 87654321",
    eventId
  });


  /* ALCOHOLICS */
  const alcCat = await db.Category.create({
    name: "Alkoholisches",
    enabled: true,
    icon: "beer",
    description: "alkohol",
    showAmount: true,
    printerId,
    color: '#f59e0b',
    eventId
  });
  let [lUnit] = await db.Unit.findOrCreate({
    where: { name: "l", eventId },
    defaults: { name: "l", eventId }
  });
  await db.Item.bulkCreate([
  ]);
  let [clUnit] = await db.Unit.findOrCreate({
    where: { name: "cl", eventId },
    defaults: { name: "cl", eventId }
  });
  await db.Item.bulkCreate([
  ]);

  /* NONALCOHOLICS */

  const coffeeCat = await db.Category.create({
    name: "Kaffee",
    enabled: true,
    icon: "coffee",
    description: "Kaffee",
    showAmount: false,
    printerId,
    color: '#8b5cf6',
    eventId
  });
  let [stkUnit] = await db.Unit.findOrCreate({
    where: { name: "Stk.", eventId },
    defaults: { name: "Stk.", eventId }
  });
  await db.Item.bulkCreate(
    kaffee.map(x => ({
      name: x,
      amount: 1,
      price: Number((Math.round(Math.random() * 20 * 10) / 10).toFixed(2)),
      unitId: stkUnit.id,
      categoryId: coffeeCat.id,
      eventId
    }))
  );

  const dessertCat = await db.Category.create({
    name: "Dessert",
    enabled: true,
    icon: "cake",
    description: "Dessert",
    showAmount: false,
    printerId,
    color: '#f43f5e',
    eventId
  });
  let [stkUnit2] = await db.Unit.findOrCreate({
    where: { name: "Stk.", eventId },
    defaults: { name: "Stk.", eventId }
  });
  await db.Item.bulkCreate(
    dessert.map(x => ({
      name: x,
      amount: 1,
      price: Number((Math.round(Math.random() * 20 * 10) / 10).toFixed(2)),
      unitId: stkUnit2.id,
      categoryId: dessertCat.id,
      eventId
    }))
  );


  const nonAlcCat = await db.Category.create({
    name: "Alkoholfreies",
    enabled: true,
    icon: "coffee",
    description: "Alkoholfreies",
    showAmount: true,
    printerId,
    color: '#14b8a6',
    eventId
  });
  let [lUnit2] = await db.Unit.findOrCreate({
    where: { name: "l", eventId },
    defaults: { name: "l", eventId }
  });
  await db.Item.bulkCreate([
  ]);

  let [terrace] = await db.Area.findOrCreate({
    where: { name: "Terrasse", eventId },
    defaults: { name: "Terrasse", color: '#2acb54', short: "T", eventId }
  });
  for (let i = 0; i < 12; i++) {
    await db.Table.create({
      name: i,
      x: 1,
      y: 2,
      areaId: terrace.id,
      eventId
    });
  }

  let [gaststube] = await db.Area.findOrCreate({
    where: { name: "Gaststube", eventId },
    defaults: { name: "Gaststube", color: '#45b1a4', short: "G", eventId }
  });
  for (let i = 0; i < 12; i++) {
    await db.Table.create({
      name: i,
      x: 1,
      y: 2,
      areaId: gaststube.id,
      eventId
    });
  }
};
