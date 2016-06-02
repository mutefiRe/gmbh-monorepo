'use strict'

const express = require('express');
const router = express.Router();
const db = require('../models/index');

router.use(function timeLog(req, res, next){
  //console.log('Time: ', Date.now());
  next();
})

router.get('/:id', function(req, res){
  db.Table.find({where: {id: req.params.id}}).then(data => {
    res.send({'table': data});
  })
})

router.get('/:id/items', function(req, res){
  db.Areas.find({where: {TableId: req.params.id}}).then(data => {
    console.log(data)
    res.send({'items': data});
  })
})


router.get('/', function(req, res){
  db.Table.findAll({include: [{model: db.Area}]}).then(data =>
  {
    if(data[0] === undefined){
      res.status(404).send("couldn't find any Tables")
      return
    }
    else
    {
      let tables = JSON.parse(JSON.stringify(data));
      for(var i = 0; i < tables.length; i++){
        tables[i].area = tables[i].Area.id;
        tables[i].Area = undefined
      }
      res.send({'table': tables});
    }
  })
})


router.post('/', function(req, res){
  db.Table.create(req.body.table).then( data => {
    res.send({'table': data});
  })
})

router.put('/:id', function(req, res){
  db.Table.find({where: {id: req.params.id}}).then(table => {
    table.update(req.body).then( data => {
     res.send({'table': data});
   })
  })
})

router.delete('/:id', function(req, res){
  db.Table.find({where: {id: req.params.id}}).then(table=>{
    table.destroy()
  })
  res.send({'table': data});
})

module.exports = router;
