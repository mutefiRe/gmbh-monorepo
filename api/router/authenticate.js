'use strict'

const express = require('express');
const router = express.Router();
const db = require('../models/index');
const jwt    = require('jsonwebtoken');
const config = require('../config/config.js');

router.post('/', function(req, res){
  db.User.findOne({where: {
    username: req.body.username
  }}).then((thisUser) => {
    if (!thisUser) {
      res.status(400).send({ error: 'Authentication failed. User not found.' })
    }
    else if (thisUser.validPassword(req.body.password)) {
      const userObject = {
        "id": thisUser.dataValues.id,
        "username": thisUser.dataValues.username,
        "permission": thisUser.dataValues.permission,
        "firstname": thisUser.dataValues.firstname,
        "lastname": thisUser.dataValues.lastname
      };
      const token = jwt.sign(userObject, config.secret, { expiresIn: '72h' });

      res.send({token});
    }
    else res.status(400).send({error: 'Authentication failed. Wrong Password'});
  })
})

module.exports = router;
