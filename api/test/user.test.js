module.exports = function(){
  'use strict'

  const chai = require('chai');
  const mocha = require('mocha');
  const db = require('../models/index.js');

  db.User.sync({force: true});

}
