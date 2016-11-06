'use strict'

const express = require('express');
const router = express.Router();
const db = require('../models/index');
const serialize = require('../serializers/table');

router.get('/:id', function(req, res){
  db.Table.find({where: {id: req.params.id}}).then(data => {
    res.send({'table': data});
  })
})

router.get('/:id/items', function(req, res){
  db.Areas.find({where: {tableId: req.params.id}}).then(data => {
    console.log(data)
    res.send({'items': data});
  })
})


router.get('/', function(req, res){
  db.Table.findAll({include: [{model: db.Area}]}).then(data =>
  {
    let tables = JSON.parse(JSON.stringify(data));
    for(var i = 0; i < tables.length; i++){
      tables[i].area = tables[i].area.id;
    }
    res.send({'table': tables});
  })
})


router.post('/', function(req, res){
  const io = req.app.get('io');
  db.Table.create(serialize(req.body.table)).then( data => {
    res.send({'table': data});
    io.sockets.emit("update", {'table': data});
  })
})

router.put('/:id', function(req, res){
  const io = req.app.get('io');
  db.Table.find({where: {id: req.params.id}}).then(table => {
    table.update(serialize(req.body.table)).then( data => {
      res.send({table: data});
      io.sockets.emit("update", {table: data});
    })
  })
})

router.delete('/:id', function(req, res){
  db.Table.find({where: {id: req.params.id}}).then(table=>{
    table.destroy()
  })
  res.send({});
})

module.exports = router;
