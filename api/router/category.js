'use strict'

const express = require('express');
const router = express.Router();
const db = require('../models/index');

router.use(function timeLog(req, res, next){
  //console.log('Time: ', Date.now());
  next();
})

router.get('/:id', function(req, res){
  db.Category.find({where: {id: req.params.id}}).then(data => {
    res.send({'category': data});
  })
})

router.get('/:id/items', function(req, res){
  db.Items.find({where: {CategoryId: req.params.id}}).then(data => {
    console.log(data)
    res.send({'items': data});
  })
})


router.get('/', function(req, res){
  db.Category.findAll().then(data =>
  {
    res.send({'category': data});
  })
})


router.post('/', function(req, res){
  db.Category.create(req.body.category).then( data => {
    res.send({'category': data});
  })
})

router.put('/:id', function(req, res){
  db.Category.find({where: {id: req.params.id}}).then(category => {
    category.update(req.body).then( data => {
     res.send({'category': data});
   })
  })
})

router.delete('/:id', function(req, res){
  db.Category.find({where: {id: req.params.id}}).then(category=>{
    category.destroy()
  })
  res.send({'category': data});
})

module.exports = router;
