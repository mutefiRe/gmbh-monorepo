'use strict'

const express = require('express');
const server = require('http').Server(express);
const io = require('socket.io')(server);
const router = express.Router();
const db = require('../../models/index');
const serialize = require('../../serializers/order');
const print = require('../../print.js');

// GET one order with orderitems
router.get('/:id', function(req, res){
  db.Order.find({where: {id: req.params.id}, include: [{model: db.Orderitem}]}).then(data => {
    let order = JSON.parse(JSON.stringify(data));
    order.orderitems = order.orderitems
    res.send({'order': data});
  })
})

// GET my orders with orderitems
router.get('/', function(req, res){
  db.Order.findAll({where: {userId: req.decoded.id}, include: [{model: db.Orderitem},{model: db.Table}]}).then(data =>
  {
    let orders = JSON.parse(JSON.stringify(data));
    for(let i = 0; i < orders.length; i++){
      orders[i].orderitems = orders[i].orderitems
      orders[i].table = orders[i].table.id;
    }
    res.send({'order': orders});
  })
})

// CREATE order with orderitems
router.post('/', function(req, res){
  var reqData = serialize(req.body.order)
  var orderitems = reqData.orderitems
  var orderId = null;
  const io = req.app.get('io');
  db.Order.create(reqData)
  .then( data => {
    orderitems.map((x) => {
      x.orderId = data.id;
      x.itemId  = x.item;
    })
    orderId = data.id
    return db.Orderitem.bulkCreate(orderitems);
  })
  .then(() => {
    return db.Order.findById(orderId, {include: [{model: db.Orderitem}]});
  })
  .then((data) => {
    let order = JSON.parse(JSON.stringify(data));

    mapOrderItems(order)
    mapOrderRelations(order)

    res.send({'order': order});
    // io.sockets.emit("update", {'order': order});
  })
})

router.put('/:id', function(req, res){
  const io = req.app.get('io');
  db.Order.findById(req.params.id, {include: [{model: db.Orderitem, include: [{model: db.Item}]}]}).then(order => {
    order.update(serialize(req.body.order)).then( data => {

      let order = JSON.parse(JSON.stringify(data));

      mapOrderItems(order)
      mapOrderRelations(order)

      res.send({'order': order});
      // io.sockets.emit("update", {'order': data});
    })
  })
})

router.delete('/:id', function(req, res){
  db.Order.find({where: {id: req.params.id}}).then(order=>{
    order.destroy()
  })
  res.send({});
})

module.exports = router;

function mapOrderItems(order){
  order.orderitems.map(x => {
    x.item  = x.itemId;
    x.order = x.orderId;
    delete(x.itemId);
    delete(x.orderId);
  })
  delete(order.orderitems);
}

function mapOrderRelations(order){
  order.table = order.tableId;
  order.user = order.userId;
  delete(order.tableId);
  delete(order.userId);
}
