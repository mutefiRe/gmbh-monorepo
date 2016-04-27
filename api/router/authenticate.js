'use strict'

const express = require('express');
const router = express.Router();
const user = require('../models/user');
const jwt    = require('jsonwebtoken');
const config = require('../config/config.js')

router.use(function timeLog(req, res, next){
  //console.log('Time: ', Date.now());
  next();
})

router.post('/', function(req, res){
  user.User.findOne({where: {
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
        console.log(config)
        let token = jwt.sign(thisUser.dataValues, config.secret);

        thisUser.update({
          token: token
        })
        console.log(token)
        res.send({success:true, message: 'Authentication successful', token: token})
      }
    }
  })
})

module.exports = router;
