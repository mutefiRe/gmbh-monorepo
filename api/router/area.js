'use strict'

const express = require('express');
const router = express.Router();
const db = require('../models/index');
const serialize = require('../serializers/area');

router.use(function timeLog(req, res, next){
  //console.log('Time: ', Date.now());
  next();
})

router.get('/:id', function(req, res){
  db.Area.find({where: {id: req.params.id}}).then(data => {
    res.send({'area': data});
  })
})

router.get('/', function(req, res){
  db.Area.findAll({include: [{model: db.Table}, {model: db.User}]}).then(data =>
  {
    let areas = JSON.parse(JSON.stringify(data));
    for(var i = 0; i < areas.length; i++){
      areas[i].tables = areas[i].Tables.map(table => table.id);
      areas[i].Tables = undefined;

      areas[i].users = areas[i].Users.map(user => user.id);
      areas[i].Users = undefined;
    }
    res.send({'area': areas});
  })
})

router.post('/', function(req, res){
  const io = req.app.get('io');
  db.Area.create(serialize(req.body.area)).then( data => {
    res.send({'area': data});
    io.sockets.emit("update", {'area': data});
  })
})

router.put('/:id', function(req, res){
  const io = req.app.get('io');
  db.Area.find({where: {id: req.params.id}}).then(area => {
    area.update(serialize(req.body.area)).then( data => {
      res.send({'area': data});
      io.sockets.emit("update", {'area': data});
    })
  })
})

router.delete('/:id', function(req, res){
  db.Area.find({where: {id: req.params.id}}).then(area=>{
    area.destroy()
  })
  res.send({});
})

module.exports = router;
