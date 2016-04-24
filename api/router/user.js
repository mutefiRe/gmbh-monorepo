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
	user.create(req.body)
	console.log(req.body)
	res.send('save user');
})

router.put('/:id', function(req, res){
	res.send('updated user '+req.params.id);
})

module.exports = router;