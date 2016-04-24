var express = require('express');
var router = express.Router();

router.use(function timeLog(req, res, next){
	console.log('Time: ', Date.now());
	next();
})

router.get('/:id', function(req, res){
	res.send('get user '+req.params.id);
})

router.post('/:id', function(req, res){
	res.send('save user '+req.params.id);
})

router.put('/:id', function(req, res){
	res.send('update user '+req.params.id);
})

module.exports = router;