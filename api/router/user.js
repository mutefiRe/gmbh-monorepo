'use strict'

const express = require('express');
const router = express.Router();
const db = require('../models/index');


router.use(function timeLog(req, res, next){
	//console.log('Time: ', Date.now());
	next();
})

router.get('/:id', function(req, res){
	res.send('get user '+req.params.id);
})

router.get('/', function(req, res){
  res.send('get users ');
})


router.post('/', function(req, res){
	db.User.create(req.body);
	res.send('saved user '+req.body.username);
})

router.put('/:id', function(req, res){
	res.send('updated user '+req.params.id);
})

router.delete('/:id', function(req, res){
	res.send('deleted user '+req.params.id)
})

module.exports = router;
