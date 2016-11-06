'use strict';

const express   = require('express');
const router    = express.Router();
const db        = require('../models/index');
const serialize = require('../serializers/order');

// GET one order with orderitems
router.get('/:id', function(req, res){
  db.Order.find({where: {id: req.params.id}, include: [{model: db.Orderitem}]}).then(order => {
    res.send({order});
  });
});

// GET my orders with orderitems
router.get('/', function(req, res){
  db.Order.findAll({where: {userId: req.decoded.id}, include: [{model: db.Orderitem},{model: db.Table}]}).then(data =>
  {
    const orders = JSON.parse(JSON.stringify(data));
    for(let i = 0; i < orders.length; i++){
      orders[i].table = orders[i].table.id;
    }
    res.send({'order': orders});
  });
});

// CREATE order with orderitems
router.post('/', function(req, res){
  const requestOrder = serialize(req.body.order);
  const orderitems   = requestOrder.orderitems;
  let   orderId      = null;
  // const io = req.app.get('io');
  db.Order.create(requestOrder)
  .then( data => {
    orderitems.map(x => {
      x.orderId = data.id;
      x.itemId  = x.item;
    });
    orderId = data.id;
    return db.Orderitem.bulkCreate(orderitems);
  })
  .then(() => {
    return db.Order.findById(orderId, {include: [{model: db.Orderitem}]});
  })
  .then(data => {
    const order = JSON.parse(JSON.stringify(data));

    mapOrderItems(order);
    mapOrderRelations(order);

    res.send({order});
    // io.sockets.emit("update", {'order': order});
  });
});

router.put('/:id', function(req, res){
  // const io = req.app.get('io');
  db.Order.findById(req.params.id, {include: [{model: db.Orderitem, include: [{model: db.Item}]}]}).then(order => {
    order.update(serialize(req.body.order)).then( data => {

      const order = JSON.parse(JSON.stringify(data));

      mapOrderItems(order);
      mapOrderRelations(order);

      res.send({order});
      // io.sockets.emit("update", {'order': data});
    });
  });
});

router.delete('/:id', function(req, res){
  db.Order.find({where: {id: req.params.id}}).then(order => {
    order.destroy();
  });
  res.send({});
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
