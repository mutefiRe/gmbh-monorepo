'use strict';

const router = require('express').Router();
const jwt = require('jsonwebtoken');
const acl = require('express-acl');
const config = require('../config/config');
const fs = require("fs");
const normalizedPath = require("path").join(__dirname, "api");

acl.config({
  baseUrl: 'api',
  filename: 'acl.json',
  path: 'config'
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

router.use(acl.authorize);


fs.readdirSync(normalizedPath).forEach(function (file) {
  router.use(`/${file.split(".js")[0]}`, require("./api/" + file));
});

router.get('/', function (req, res) {
  res.status(200).send({ "msg": "you have access to the api" });
});


module.exports = router;
