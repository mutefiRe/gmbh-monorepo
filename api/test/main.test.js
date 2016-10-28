'use strict'

const integrationTests = require('./integration.js');
const db = require('../models/index');

describe('Test Now - Force Synced Database', () => {

  // SET FOREIGN KEY CONSTRAINT CHECK TO ZERO TO DELETE WHOLE TABLES
  before(function(done){
    db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
    .then(() => {
      return db.sequelize.sync({force:true})
    }).then(() => {
      return db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
    }).then(() => {
      done()
    })
  })

  integrationTests();
})
