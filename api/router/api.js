'use strict'

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const userPath = require('./user.js')
const categoryPath = require('./category')
const organizationPath = require('./organization.js')
const settingPath = require('./setting.js')
const unitPath = require('./unit.js')
const itemPath = require('./item.js')
const db = require('../models')


// Verification of Access
router.use(function(req, res, next) {

  // Get Token of Request
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // if token available
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return res.status(400).send({
          'error': {
            'msg': err.message
          }
        });
      } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          next();
        }
      });
  } else {

    // if there is no token
    // return an error
    return res.status(400).send({
      "error": {
        "msg": "No token provided"
      }
    });

  }
});


router.use('/user', userPath);
router.use('/category', categoryPath);
router.use('/organization', organizationPath)
router.use('/setting', settingPath)
router.use('/item', itemPath)
router.use('/unit', unitPath)
router.get('/', function(req, res){
  res.status(200).send({"msg": "you have access to the api"})
})


module.exports = router;
