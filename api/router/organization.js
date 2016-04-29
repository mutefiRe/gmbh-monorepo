'use strict'

const express = require('express');
const router = express.Router();
const db = require('../models/index');

router.use(function timeLog(req, res, next){
	//console.log('Time: ', Date.now());
	next();
})

router.get('/:id', function(req, res){
	db.Organization.find({where: {id: req.params.id}}).then(data => {
    if(data === null){
      res.status(404).send("couldn't find organization")
      return
    }
    res.send(data);
  })
})

router.get('/', function(req, res){
  db.Organization.findAll().then(data =>
  {
    if(data[0] === undefined){
      res.status(404).send("couldn't find any organizations")
      return
    }
    res.send(data);
  })
})


router.post('/', function(req, res){
	db.Organization.create(req.body.organization).then( data => {
    res.send(data);
  }).catch(err => {
    res.status(400).send(err.errors[0].message)
  })
})

router.put('/:id', function(req, res){
  db.Organization.find({where: {id: req.params.id}}).then(organization => {
    if(organization === null){
      res.status(404).send("couldn't find organization which should be updated")
      return
    }
    organization.update(req.body.organization).then( data => {
      res.send(data)
    }).catch(err => {
      res.status(400).send(err.errors[0].message)
    })
  })
})

router.delete('/:id', function(req, res){
  db.Organization.find({where: {id: req.params.id}}).then(organization=>{
    if(organization === null){
      res.status(404).send("couldn't find organization which should be deleted")
      return
    }
    organization.destroy().then(()=>{
		  res.send('deleted organization '+organization.name)
    })
  })
})

module.exports = router;
