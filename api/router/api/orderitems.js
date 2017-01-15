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

router.get('/', function(req, res){
  db.Orderitem.findAll({include: [{model: db.Item}, {model: db.Order, where: {userId: req.decoded.id}}]}).then(orderitems => {
    res.send(orderitems);
  });
});

router.post('/', function(req, res){
  db.Orderitem.create(req.body.orderitem).then( orderitem => {
    res.send({orderitem});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

router.put('/:id', function(req, res){
  // const io = req.app.get('io');
  db.Orderitem.update(req.body.orderitem, {where: {id: req.params.id}})
  .then(() => {
    return db.Orderitem.findById(req.params.id);
  }).then(orderitem => {
    res.send({orderitem});
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
