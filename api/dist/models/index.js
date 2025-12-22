"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sequelize_1 = require("sequelize");
const dbConfig = require("../config/DBconfig");
const config = dbConfig();
const sequelize = new sequelize_1.Sequelize(config.database, config.user, config.password, config.options);
const db = {};
fs_1.default
    .readdirSync(__dirname)
    .filter((file) => file.indexOf(".") !== 0 && file !== "index.ts" && file !== "index.js")
    .forEach((file) => {
    const modelFactory = require(path_1.default.join(__dirname, file));
    const factory = modelFactory.default || modelFactory;
    const model = factory(sequelize, sequelize_1.DataTypes);
    db[capitalize(model.name)] = model;
});
Object.keys(db).forEach((modelName) => {
    if ("associate" in db[modelName])
        db[modelName].associate(db);
});
db.sequelize = sequelize;
db.Sequelize = sequelize_1.Sequelize;
exports.default = db;
function capitalize(s) {
    return s && s[0].toUpperCase() + s.slice(1);
}
// Support CommonJS require() import style.
module.exports = db;
