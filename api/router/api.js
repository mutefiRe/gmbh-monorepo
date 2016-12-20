'use strict';

const router = require('express').Router();
const jwt            = require('jsonwebtoken');
const config         = require('../config/config');
const fs             = require("fs");
const normalizedPath = require("path").join(__dirname, "api");

/**
 * @apiDefine token
 * @apiParam {string} x-access-token JSONWebToken | Mandatory if not set as header
 * @apiHeader {string} x-access-token JSONWebToken | Mandatory if not in params
 */

router.use(function(req, res, next) {

  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, config.secret, function(error, decoded) {

      if (error) {
        return res.status(400).send({
          'errors': {
            'msg': error.message
          }
        });
      }
      req.decoded = decoded;
      next();
    });

  } else {
    res.status(400).send({
      'errors': {
        "msg": "No token provided"
      }
    });
  }
});


fs.readdirSync(normalizedPath).forEach(function(file) {
  router.use(`/${file.split(".js")[0]}`, require("./api/" + file));
});

router.get('/', function(req, res){
  res.status(200).send({"msg": "you have access to the api"});
});

module.exports = router;
