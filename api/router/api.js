'use strict'

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const userPath = require('./user.js')
const organizationPath = require ('./organization.js')
const settingPath = require ('./setting.js')
//const unitPath = require ('./unit.js')
//const itemPath = require ('./item.js')
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
        return res.status(400).send({ success: false, message: 'Failed to authenticate token.' });
      } else if ((new Date(decoded.exp*1000)) < Date.now()){

         return res.status(400).send({ success: false, message: 'Token has expired' });
      }
      else {
        console.log(new Date(decoded.exp*1000))
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        console.log(decoded)
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(400).send({
        success: false,
        message: 'No token provided.'
    });

  }
});


router.use('/user', userPath)
router.use('/organization', organizationPath)
router.use('/setting', settingPath)
//router.use('/item', itemPath)
//router.use('/unit', unitPath)


module.exports = router;
