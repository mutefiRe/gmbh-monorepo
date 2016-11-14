'use strict'

const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const config  = require('../config/config');
const fs      = require("fs");
var normalizedPath = require("path").join(__dirname, "api");

// Verification of Access
router.use(function(req, res, next) {

  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return res.status(400).send({
          'error': {
            'msg': err.message
          }
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(400).send({
      "error": {
        "msg": "No token provided"
      }
    });
  }
});

fs.readdirSync(normalizedPath).forEach(function(file) {
  router.use(`/${file.split(".js")[0]}`, require("./api/" + file));
});

router.get('/', function(req, res){
  res.status(200).send({"msg": "you have access to the api"})
})

module.exports = router;
