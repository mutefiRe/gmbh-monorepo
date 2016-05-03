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
        res.status(400).send({ error: 'Authentication failed. User not found.' })
      }
      else if (thisUser){
        if (thisUser.password != req.body.password){
          res.status(400).send({error: 'Authentication failed. Wrong Password'})
        }
        else {
          /*
          var expires = new Date();
          expires.setDate(expires.getDate() + 1);
          */
          let userObject = {
            "id": thisUser.dataValues.id,
            "username": thisUser.dataValues.username,
            "permission": thisUser.dataValues.permission,
            "firstname": thisUser.dataValues.firstname,
            "lastname": thisUser.dataValues.lastname
          }
          let token = jwt.sign(userObject, config.secret, { expiresIn: '24h' });

          res.send({token: token})
        }
      }
  })
})

module.exports = router;
