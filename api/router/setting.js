'use strict'

const express = require('express');
const router = express.Router();
const db = require('../models/index');

router.use(function timeLog(req, res, next){
  //console.log('Time: ', Date.now());
  next();
})

router.get('/:id', function(req, res){
  db.Setting.find({where: {id: req.params.id}}).then(data => {
    if(data === null){
      res.status(404).send("couldn't find setting")
      return
    }
    res.send(data);
  })
})

router.get('/', function(req, res){
  db.Setting.findAll().then(data =>
  {
    if(data[0] === undefined){
      res.status(404).send("couldn't find any settings")
      return
    }
    res.send(data);
  })
})


router.post('/', function(req, res){
  db.Setting.create(req.body.setting).then( data => {
    res.send(data);
  }).catch(err => {
    res.status(400).send(err.errors[0].message)
  })
})

router.put('/:id', function(req, res){
  db.Setting.find({where: {id: req.params.id}}).then(setting => {
    if(setting === null){
      res.status(404).send("couldn't find setting which should be updated")
      return
    }
    setting.update(req.body.setting).then( data => {
      res.send(data)
    }).catch(err => {
      res.status(400).send(err.errors[0].message)
    })
  })
})

router.delete('/:id', function(req, res){
  db.Setting.find({where: {id: req.params.id}}).then(setting=>{
    if(setting === null){
      res.status(404).send("couldn't find setting which should be deleted")
      return
    }
    setting.destroy().then(()=>{
      res.send('deleted setting '+setting.name)
    })
  })
})

module.exports = router;
