'use strict'

const express = require('express');
const router = express.Router();
const db = require('../models/index');

router.use(function timeLog(req, res, next){
  //console.log('Time: ', Date.now());
  next();
})

router.get('/me', function(req, res){
  db.User.find({where: {
    id: res.decoded.id
  }}).then(data =>
  {
    res.send(data);
  })
})

router.get('/:id', function(req, res){
  db.User.find({where: {id: req.params.id}}).then(data => {
    if(data === null){
      res.status(404).send("couldn't find user")
      return
    }
    res.send(data);
  })
})

router.get('/', function(req, res){
  db.User.findAll().then(data =>
  {
    if(data[0] === undefined){
      res.status(404).send("couldn't find any users")
      return
    }
    res.send(data);
  })
})


router.post('/', function(req, res){
  db.User.create(req.body.user).then( data => {
    res.send(data);
  }).catch(err => {
    res.status(400).send(err.errors[0].message)
  })
})

router.put('/:id', function(req, res){
  db.User.find({where: {id: req.params.id}}).then(user => {
    if(user === null){
      res.status(404).send("couldn't find user which should be updated")
      return
    }
    user.update(req.body.user).then( data => {
      res.send(data)
    }).catch(err => {
      res.status(400).send(err.errors[0].message)
    })
  })
})

router.delete('/:id', function(req, res){
  db.User.find({where: {id: req.params.id}}).then(user=>{
    if(user === null){
      res.status(404).send("couldn't find user which should be deleted")
      return
    }
    user.destroy().then(()=>{
      res.send('deleted user '+user.firstname)
    })
  })
})




module.exports = router;
