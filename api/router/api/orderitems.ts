'use strict';

const router = require('express').Router();
const db = require('../../models');

router.get('/:id', function (req, res) {
  db.Orderitem.findOne({
    where: { id: req.params.id },
    include: [{ model: db.Order, where: { eventId: req.eventId } }]
  }).then(data => {
    if (data === null) {
      res.status(404).send("couldn't find item");
      return;
    }
    res.send({ 'item': data });
  });
});

router.get('/', function (req, res) {
  db.Orderitem.findAll({
    include: [
      { model: db.Item },
      { model: db.Order, where: { userId: req.decoded.id, eventId: req.eventId } }
    ]
  }).then(orderitems => {
    res.send(orderitems);
  });
});

router.post('/', function (req, res) {
  db.Orderitem.create(req.body.orderitem).then(orderitem => {
    res.send({ orderitem });
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

router.put('/:id', function (req, res) {
  db.Orderitem.findOne({
    where: { id: req.params.id },
    include: [{ model: db.Order, where: { eventId: req.eventId } }]
  }).then(orderitem => {
    if (!orderitem) {
      res.status(404).send({ errors: { msg: 'orderitem not found' } });
      return null;
    }
    return orderitem.update(req.body.orderitem);
  }).then(orderitem => {
    if (!orderitem) return;
    res.send({ orderitem });
  }).catch(error => {
      res.status(400).send({
        'errors': {
          'msg': error && error.errors && error.errors[0].message || error.message
        }
      });
    });
});

router.delete('/:id', async function (req, res) {
  try {
    const item = await db.Orderitem.findOne({
      where: { id: req.params.id },
      include: [{ model: db.Order, where: { eventId: req.eventId } }]
    });
    if (item === null) {
      res.status(404).send({
        'errors': {
          'msg': 'orderitem not found'
        }
      });
      return;
    }
    await item.destroy();
    res.send({});
  } catch (error) {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  }
});

module.exports = router;
