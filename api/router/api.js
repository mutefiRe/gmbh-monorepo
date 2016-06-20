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
const orderItemPath = require('./orderitem.js')
const orderPath = require('./order.js')
const tablePath = require('./table.js')
const areaPath = require('./area.js')
const printPath = require('./print.js')
const printerPath = require('./printer.js')
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

router.use('/prints', printPath);
router.use('/printers', printerPath);
router.use('/users', userPath);
router.use('/orders', orderPath);
router.use('/orderItems', orderItemPath);
router.use('/categories', categoryPath);
router.use('/organizations', organizationPath)
router.use('/settings', settingPath)
router.use('/items', itemPath)
router.use('/units', unitPath)
router.use('/tables', tablePath)
router.use('/areas', areaPath)
router.get('/', function(req, res){
  res.status(200).send({"msg": "you have access to the api"})
})

module.exports = router;
