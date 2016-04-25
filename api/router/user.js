var express = require('express');
var router = express.Router();
var user = require('../models/user');

router.use(function timeLog(req, res, next){
	//console.log('Time: ', Date.now());
	next();
})

router.get('/:id', function(req, res){
	res.send('get user '+req.params.id);
})

router.post('/', function(req, res){
	console.log(req.body)
	res.send('saved user '+req.body.username);
})

router.put('/:id', function(req, res){
	res.send('updated user '+req.params.id);
})

router.delete('/:id', function(req, res){
	res.send('deleted user '+req.params.id)
})

module.exports = router;