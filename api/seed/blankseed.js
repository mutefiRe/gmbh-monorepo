"use strict";

const db = require("../models/index");

module.exports = async function () {
  await db.User.create({
    username: "admin",
    firstname: "Sebastian",
    lastname: "Huber",
    password: "abc",
    role: "admin"
  });

  await db.Organization.create({
    uid: "blaaaah",
    name: "GehMalBierHolen Gmbh",
    street: "Urstein Süd",
    street_number: "1",
    postalcode: "5412",
    city: "Puch bei Hallein",
    telephone: "+43 650 12345678"
  });

  await db.Setting.create({
    name: 'veranstaltungsname',
    begin_date: "nodate",
    end_date: "nodate",
    instantPay: true,
    customTables: true,
    receiptPrinterId: null,
    expiresTime: "72h",
    showItemPrice: true
  });
};
