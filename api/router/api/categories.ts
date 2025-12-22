'use strict';

const router = require('express').Router();
const db = require('../../models');
const { createNotification } = require('../../util/notifications');

router.get('/:id', function (req, res) {
  db.Category.findOne({ where: { id: req.params.id, eventId: req.eventId } }).then(category => {
    res.send({ category });

  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

router.get('/', function (req, res) {
  db.Category.findAll({ where: { eventId: req.eventId } }).then(categories => {
    res.send({ categories });
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

router.post('/', function (req, res) {
  const io = req.app.get('io');
  const payload = { ...req.body.category, eventId: req.eventId };
  db.Category.create(payload).then(category => {
    res.send({ category });
    io.sockets.emit("update", { category, eventId: req.eventId });
    createNotification({
      eventId: req.eventId,
      entityType: 'category',
      entityId: category.id,
      action: 'created',
      message: `Neue Kategorie: ${category.name}`
    }).then((notification) => {
      if (notification) {
        io.sockets.emit("notification", { notification, eventId: req.eventId });
      }
    });
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

router.put('/:id', async function (req, res) {
  if (!req.body.category) {
    res.status(400).send({
      'errors': {
        'msg': "no category data provided"
      }
    });
    return;
  }
  const io = req.app.get('io');
  try {
    const category = await db.Category.findOne({ where: { id: req.params.id, eventId: req.eventId } });
    if (category === null) {
      res.status(404).send({ errors: { msg: "category not found" } });
      return;
    }
    await category.update({ ...req.body.category, eventId: req.eventId });
    await category.save();
    res.send({ category });
    io.sockets.emit("update", { category, eventId: req.eventId });
  } catch (error) {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  }
});

router.delete('/:id', function (req, res) {
  const io = req.app.get('io');
  db.Category.findOne({ where: { id: req.params.id, eventId: req.eventId } }).then(category => {
    if (category === null) throw new Error('category not found');
    return category.destroy();
  }).then(category => {
    res.send({});
    io.sockets.emit("delete", { 'type': 'category', 'id': category.id, eventId: req.eventId });
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

module.exports = router;
