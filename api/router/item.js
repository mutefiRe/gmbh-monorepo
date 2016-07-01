'use strict'

const express = require('express');
const router = express.Router();
const db = require('../models/index');
const serialize = require('../serializers/item');


router.get('/:id', function(req, res){
  db.Item.find({where: {id: req.params.id}}).then(data => {
    if(data === null){
      res.status(404).send("couldn't find item")
      return
    }
    res.send({'item':data});
  })
})

router.get('/', function(req, res){
  db.Item.findAll({include: [{model: db.Unit}]}).then(data =>
  {
    let items = JSON.parse(JSON.stringify(data));
    for(var i = 0; i < items.length; i++){
      items[i].unit = items[i].Unit.id
      items[i].Unit = undefined
    }
    res.send({'item': items});
  })
})



router.post('/', function(req, res){
  const io = req.app.get('io');
  db.Item.create(serialize(req.body.item)).then( data => {
    res.send({'item':data});
    io.sockets.emit("update", {'item':data});
    return db.Category.find({where: {id: data.CategoryId}, include: [{model: db.Item}]}).then((catData) =>
    {
      let categories = JSON.parse(JSON.stringify(catData));
      categories.items = categories.Items.map(item => item.id);
      categories.Items = undefined
      io.sockets.emit("update", {'category': categories});
    })
  }).catch(err => {
    res.status(400).send(err.errors[0].message)
  })
})

router.put('/:id', function(req, res){
  const io = req.app.get('io');
  db.Item.find({where: {id: req.params.id}}).then(item => {
    if(item === null){
      res.status(404).send("couldn't find Item which should be updated")
      return
    }
    item.update(serialize(req.body.item)).then( data => {
      res.send({'item':data})
      io.sockets.emit("update", {'item':data})
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
      res.send({})
    })
  })
})


module.exports = router;
