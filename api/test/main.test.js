'use strict'

const socketTest = require("./socket.test")
const routeTest = require("./route.test")
const userTest = require("./user.test")
const apiTest = require("./api.test")
const authenticateTest = require("./authenticate.test")
const db = require('../models/index');
const mocha = require('mocha')


describe('Test Now - Force Synced Database', () => {


// SET FOREIGN KEY CONSTRAINT CHECK TO ZERO TO DELETE WHOLE TABLES
before(function(done){
  db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
  .then(()=>{
   db.sequelize.sync({force:true})
   .then(() => {
    db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
    .then(()=>{
      done()
    })
  })
 })
})

before(function(done){
  db.User.create({
    username: "test1",
    firstname: "test1",
    lastname: "test1",
    password: "test1",
    permission: 0
  })
  db.User.create({
    username: "test2",
    firstname: "test2",
    lastname: "test2",
    password: "test2",
    permission: 1
  }).then(() => done())
})

userTest();
authenticateTest();
apiTest();
socketTest();

})
