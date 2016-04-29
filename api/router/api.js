'use strict'

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const userPath = require('./user.js')
const categoryPath = require('./category')
const organizationPath = require ('./organization.js')
const settingPath = require ('./setting.js')


// Verification of Access
router.use(function(req, res, next) {

  // Get Token of Request
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // if token available
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });

  }
});


router.use('/user', userPath);
router.use('/category', categoryPath);
router.use('/organization', organizationPath)
router.use('/setting', settingPath)


module.exports = router;
