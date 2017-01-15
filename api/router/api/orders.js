'use strict';

const router             = require('express').Router();
const db                 = require('../../models');

router.get('/:id', function(req, res){
  db.Order.find({where: {id: req.params.id}, include: [{model: db.Orderitem}]}).then(order => {

    order = JSON.parse(JSON.stringify(order));
    mapOrderItems(order);
    mapOrderRelations(order);
    res.send({order});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

router.get('/', function(req, res){
  db.Order.findAll({where: {userId: req.decoded.id}, include: [{model: db.Orderitem},{model: db.Table}]}).then(orders => {
    orders = JSON.parse(JSON.stringify(orders));
    for(const order of orders){
      mapOrderItems(order);
      mapOrderRelations(order);
    }

    res.send({orders});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

router.post('/', function(req, res){
  const requestOrder = req.body.order;
  const orderitems   = requestOrder.orderitems;
  let   orderId      = null;
  db.Order.create(requestOrder)
  .then( order => {
    orderitems.map(x => {
      x.orderId = order.id;
    });
    orderId = order.id;
    return db.Orderitem.bulkCreate(orderitems);
  })
  .then(() => {
    return db.Order.findById(orderId, {include: [{model: db.Orderitem}]});
  })
  .then(data => {
    const order = JSON.parse(JSON.stringify(data));

   // mapOrderItems(order);
   // mapOrderRelations(order);

    res.send({order});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

router.put('/:id', function(req, res){
  const requestOrder = req.body.order;
  db.Order.findById(req.params.id).then(order => {
    return order.update(req.body.order);
  }).then(() => {
    const promises = [];
    for(const orderitem of requestOrder.orderitems){
      const promise = db.Orderitem.update(orderitem, {where: {id: orderitem.id}});

      promises.push(promise);
    }
    return Promise.all(promises);
  }).then(() => {
    return db.Order.findById(req.params.id, {include: [{model: db.Orderitem, include: [{model: db.Item}]}]});
  }).then(data => {
    const order = JSON.parse(JSON.stringify(data));

    mapOrderItems(order);
    mapOrderRelations(order);

    res.send({order});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

router.delete('/:id', function(req, res){
  db.Order.find({where: {id: req.params.id}}).then(order => {
    return order.destroy();
  }).then(() => {
    res.send({});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

module.exports = router;

function mapOrderItems(order){
  order.orderitems.map(x => {

    x.item    = x.itemId;
    x.order   = x.orderId;
    x.itemId  = undefined;
    x.orderId = undefined;
  });
}

function mapOrderRelations(order){
  order.table   = order.tableId;
  order.user    = order.userId;
  order.tableId = undefined;
  order.userId  = undefined;
}
