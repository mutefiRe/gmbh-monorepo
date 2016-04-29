'use strict'

const express = require('express');
const router = express.Router();
const db = require('../models/index');


router.get('/', function(req, res){
  db.User.find({where: {
    id: res.decoded.id
  }}).then(data =>
  {
    res.send(data);
  })
})

module.exports = router;
