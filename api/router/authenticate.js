'use strict'

const express = require('express');
const router = express.Router();
const db = require('../models/index');
const jwt    = require('jsonwebtoken');
const config = require('../config/config.js')

router.use(function timeLog(req, res, next){
  //console.log('Time: ', Date.now());
  next();
})

router.post('/', function(req, res){
  db.User.findOne({where: {
    username: req.body.username
  }}).then( thisUser => {

    if (!thisUser){
      res.send({ success: false, message: 'Authentication failed. User not found.' })
    }
    else if (thisUser){
      if (thisUser.password != req.body.password){
        res.send({success: false, message: 'Authentication failed. Wrong Password'})
      }
      else {
        let token = jwt.sign(thisUser.dataValues, config.secret);

        thisUser.update({
          token: token
        }).then(updatedUser => {
          res.send({success:true, message: 'Authentication successful', user: updatedUser})
        })
      }
    }
  })
})

module.exports = router;
