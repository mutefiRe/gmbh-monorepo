const db   = require('../models');

module.exports = {
  secret: process.env.GMBH_SECRET || "oursecret",
  billprinter: db.Setting.findAll().receiptPrinter || "GMBH_STATIONAER"
};