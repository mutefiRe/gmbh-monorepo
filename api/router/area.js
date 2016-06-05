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

router.get('/:id/items', function(req, res){
  db.Items.find({where: {AreaId: req.params.id}}).then(data => {
    console.log(data)
    res.send({'items': data});
  })
})


router.get('/', function(req, res){
  db.Area.findAll({include: [{model: db.Item}]}).then(data =>
  {
    let areas = JSON.parse(JSON.stringify(data));
    for(var i = 0; i < areas.length; i++){
      areas[i].items = areas[i].Tables.map(table => table.id);
      areas[i].Items = undefined
    }
    res.send({'area': areas});
  })
})


router.post('/', function(req, res){
  db.Area.create(req.body.area).then( data => {
    res.send({'area': data});
  })
})

router.put('/:id', function(req, res){
  db.Area.find({where: {id: req.params.id}}).then(area => {
    area.update(req.body).then( data => {
     res.send({'area': data});
   })
  })
})

router.delete('/:id', function(req, res){
  db.Area.find({where: {id: req.params.id}}).then(area=>{
    area.destroy()
  })
  res.send({'area': data});
})

module.exports = router;
