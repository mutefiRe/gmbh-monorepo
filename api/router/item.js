'use strict'

const express = require('express');
const router = express.Router();
const db = require('../models/index');


router.get('/:id', function(req, res){
  db.Item.find({where: {id: req.params.id}}).then(data => {
    if(data === null){
      res.status(404).send("couldn't find item")
      return
    }
    res.send(data);
  })
})

router.get('/', function(req, res){
  db.Item.findAll().then(data =>
  {
    if(data[0] === undefined){
      res.status(404).send("couldn't find any Items")
      return
    }
    res.send(data);
  })
})


router.post('/', function(req, res){
  db.Item.create(req.body.item).then( data => {
    res.send(data);
  }).catch(err => {
    res.status(400).send(err.errors[0].message)
  })
})

router.put('/:id', function(req, res){
  db.Item.find({where: {id: req.params.id}}).then(item => {
    if(item === null){
      res.status(404).send("couldn't find Item which should be updated")
      return
    }
    item.update(req.body.item).then( data => {
      res.send(data)
    }).catch(err => {
      res.status(400).send(err.errors[0].message)
    })
  })
})

router.delete('/:id', function(req, res){
  db.Item.find({where: {id: req.params.id}}).then(item=>{
    if(item === null){
      res.status(404).send("couldn't find item which should be deleted")
      return
    }
    item.destroy().then(()=>{
      res.send('deleted item '+item.name)
    })
  })
})


module.exports = router;
