'use strict'

const express = require('express');
const router = express.Router();
const db = require('../models/index');
const serialize = require('../serializers/unit');


router.get('/:id', function(req, res){
  db.Unit.find({where: {id: req.params.id}}).then(data => {
    if(data === null){
      res.status(404).send("couldn't find unit")
      return
    }
    res.send(data);
  })
})

router.get('/', function(req, res){
  db.Unit.findAll().then(data =>
  {
    if(data[0] === undefined){
      res.status(404).send("couldn't find any units")
      return
    }
    res.send({unit : data});
  })
})


router.post('/', function(req, res){
  db.Unit.create(serialize(req.body.user)).then( data => {
    res.send(data);
  }).catch(err => {
    res.status(400).send(err.errors[0].message)
  })
})

router.put('/:id', function(req, res){
  db.Unit.find({where: {id: req.params.id}}).then(unit => {
    if(unit === null){
      res.status(404).send("couldn't find unit which should be updated")
      return
    }
    unit.update(serialize(req.body.unit)).then( data => {
      res.send(data)
    }).catch(err => {
      res.status(400).send(err.errors[0].message)
    })
  })
})

router.delete('/:id', function(req, res){
  db.Unit.find({where: {id: req.params.id}}).then(unit=>{
    if(unit === null){
      res.status(404).send("couldn't find user which should be deleted")
      return
    }
    unit.destroy().then(()=>{
      res.send('deleted user '+unit.name)
    })
  })
})




module.exports = router;
