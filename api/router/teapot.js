'use strict';

const express = require('express');
const router = express.Router();

router.get('/', function(req, res){
  res.status(418).send("I’m a teapot");
});

module.exports = router;
