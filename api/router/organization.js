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
    res.send(data);
  })
})

router.get('/', function(req, res){
  db.Organization.findAll().then(data =>
  {
    res.send(data);
  })
})


router.post('/', function(req, res){
	db.Organization.create(req.body.organization).then( data => {
    res.send(data);
  })
})

router.put('/:id', function(req, res){
  db.Organization.find({where: {id: req.params.id}}).then(organization => {
    organization.update(req.body).then( data => {
      res.send(data)
    })
  })
})

router.delete('/:id', function(req, res){
  db.Organization.find({where: {id: req.params.id}}).then(organization=>{
    organization.destroy().then(()=>{
			res.send('deleted organization '+organization.name)
    })
  })
})

module.exports = router;
