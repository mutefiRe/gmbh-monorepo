'use strict';

const router = require('express').Router();
const jwt = require('jsonwebtoken');
const acl = require('express-acl');
const config = require('../config/config');
const fs = require("fs");
const normalizedPath = require("path").join(__dirname, "api");

const areas = require('./api/areas');
const users = require('./api/users');
const organizations = require('./api/organizations');
const items = require('./api/items');
const categories = require('./api/categories');
const units = require('./api/units');
const tables = require('./api/tables');
const orders = require('./api/orders');
const orderitems = require('./api/orderitems');
const settings = require('./api/settings');
const printers = require('./api/printers');
const prints = require('./api/prints');

acl.config({
  baseUrl: 'api',
  filename: 'acl.json',
  path: 'config',
});

/**
 * @apiDefine token
 * @apiParam {string} x-access-token JSONWebToken | Mandatory if not set as header
 * @apiHeader {string} x-access-token JSONWebToken | Mandatory if not in params
 */

router.use(function (req, res, next) {
  // Use optional chaining and fallback to empty object for robustness
  const token = (req.body?.token)
    || (req.query?.token)
    || (req.headers?.['x-access-token'])
    || (req.cookies?.['x-gmbh-token']);

  if (token) {
    jwt.verify(token, config.secret, function (error, decoded) {
      if (error) {
        return res.status(400).send({
          errors: { msg: 'auth.tokenError' }
        });
      }
      req.decoded = decoded;
      next();
    });
  } else {
    res.status(400).send({
      errors: { msg: 'auth.tokenError' }
    });
  }
});


router.use("/areas", areas);
router.use("/users", users);
router.use("/organizations", organizations);
router.use("/items", items);
router.use("/categories", categories);
router.use("/units", units);
router.use("/tables", tables);
router.use("/orders", orders);
router.use("/orderitems", orderitems);
router.use("/settings", settings);
router.use("/printers", printers);
router.use("/prints", prints);

router.get('/', function (req, res) {
  res.status(200).send({ "msg": "you have access to the api" });
});



module.exports = router;
