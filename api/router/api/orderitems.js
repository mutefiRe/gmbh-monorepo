'use strict';

const router    = require('express').Router();
const db        = require('../../models');

router.get('/:id', function(req, res){
  db.Orderitem.find({where: {id: req.params.id}}).then(data => {
    if(data === null){
      res.status(404).send("couldn't find item");
      return;
    }
    res.send({'item':data});
  });
});

router.get('/', function(req, res, next){
  db.Orderitem.findAll({include: [{model: db.Item}, {model: db.Order, where: {userId: req.decoded.id}}]}).then(orderitems => {
    orderitems = JSON.parse(JSON.stringify(orderitems));
    res.body = {orderitems};
    next();
  });
});

router.post('/', function(req, res, next){
  db.Orderitem.create(req.body.orderitem).then( orderitem => {
    orderitem = JSON.parse(JSON.stringify(orderitem));
    res.body = {orderitem};
    next();
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

router.put('/:id', function(req, res, next){
  // const io = req.app.get('io');
  db.Orderitem.update(req.body.orderitem, {where: {id: req.params.id}})
  .then(() => {
    return db.Orderitem.findById(req.params.id);
  }).then(orderitem => {
    orderitem = JSON.parse(JSON.stringify(orderitem));
    res.body = {orderitem};
    next();
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

router.delete('/:id', function(req, res){
  db.Orderitem.find({where: {id: req.params.id}}).then(item => {
    if(item === null){
      res.status(404).send({
        'errors': {
          'msg': error && error.errors && error.errors[0].message || error.message
        }
      });
      return;
    }
    item.destroy().then(() => {
      res.send({});
    });
  });
});

module.exports = router;
