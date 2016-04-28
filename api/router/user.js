'use strict'

const express = require('express');
const router = express.Router();
const db = require('../models/index');

router.use(function timeLog(req, res, next){
	//console.log('Time: ', Date.now());
	next();
})

router.get('/:id', function(req, res){
	db.User.find({where: {id: req.params.id}}).then(data => {
    res.send(data);
  })
})

router.get('/', function(req, res){
  db.User.findAll().then(data =>
  {
    res.send(data);
  })

})


router.post('/', function(req, res){
	db.User.create(req.body.user).then( data => {
    res.send(data);
  })
})

router.put('/:id', function(req, res){
  db.User.find({where: {id: req.params.id}}).then(user => {
    user.update(req.body.user).then( data => {
      res.send(data)
    })
  })
	res.send('updated user '+req.params.id);
})

router.delete('/:id', function(req, res){
	res.send('deleted user '+req.params.id)
})

module.exports = router;
