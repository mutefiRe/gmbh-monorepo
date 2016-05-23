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
  db.Category.findAll({include: [{model: db.Item}]}).then(data =>
  {
    if(data[0] === undefined){
      res.status(404).send("couldn't find any units")
      return
    }
    else
    {
      let categories = JSON.parse(JSON.stringify(data));
      for(var i = 0; i < categories.length; i++){
        categories[i].items = categories[i].Items.map(item => item.id);
        categories[i].Items = undefined
      }
      res.send({'category': categories});
    }
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
