'use strict';

const express = require('express');
const router  = express.Router();
const db      = require('../models/index');
const jwt     = require('jsonwebtoken');
const config  = require('../config/config.js');

/**
 * @api {post} authenticate/ Get token for user
 * @apiGroup Authentication
 * @apiName Authentication
 * @apiParam {String} username
 * @apiParam {String} password
 * @apiSuccess {String} token JSONWebToken
 */

router.post('/', function(req, res){
  db.User.findOne({where: {
    username: req.body.username
  }}).then(thisUser => {
    if (!thisUser) throw new Error("Authentication failed. Wrong Username");
    else if (thisUser.validPassword(req.body.password)) {
      db.Setting.findAll().then((settings) => {
        return JSON.parse(JSON.stringify(settings))[0].expiresTime;
      }).then((expiresTime) => {
        const token = jwt.sign(thisUser.createAuthUser(), config.secret, { expiresTime });
        res.send({token});
      });
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
