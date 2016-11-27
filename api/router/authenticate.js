'use strict';

const express = require('express');
const router  = express.Router();
const db      = require('../models/index');
const jwt     = require('jsonwebtoken');
const config  = require('../config/config.js');

router.post('/', function(req, res){
  db.User.findOne({where: {
    username: req.body.username
  }}).then(thisUser => {
    if (!thisUser) throw new Error("Authentication failed. Wrong Username");
    else if (thisUser.validPassword(req.body.password)) {
      const token = jwt.sign(thisUser.createAuthUser(), config.secret, { expiresIn: '72h' });
      res.send({token});
    }
    else throw new Error("Authentication failed. Wrong Password");
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

module.exports = router;
