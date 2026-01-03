"use strict";

import fs from "fs";
import path from "path";
import { Sequelize, DataTypes } from "sequelize";
const dbConfig = require("../config/DBconfig");

const config = dbConfig();
const sequelize = new Sequelize(config.database, config.user, config.password, config.options);
const db: Record<string, any> = {};

fs
  .readdirSync(__dirname)
  .filter((file) => file.indexOf(".") !== 0 && file !== "index.ts" && file !== "index.js")
  .forEach((file) => {
    const modelFactory = require(path.join(__dirname, file));
    const factory = modelFactory.default || modelFactory;
    const model = factory(sequelize, DataTypes);
    db[capitalize(model.name)] = model;
  });

Object.keys(db).forEach((modelName) => {
  if ("associate" in db[modelName]) db[modelName].associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;

function capitalize(s: string) {
  return s && s[0].toUpperCase() + s.slice(1);
}

// Support CommonJS require() import style.
module.exports = db;
