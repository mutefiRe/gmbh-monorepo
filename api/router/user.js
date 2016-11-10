'use strict';

const express = require('express');
const router = express.Router();
const db = require('../models/index');
const serialize = require('../serializers/user');

router.get('/:id', function(req, res) {
  db.User.find({where: {id: req.params.id}}).then(user => {
    res.send({user});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

router.get('/', function(req, res) {
  db.User.findAll({attributes: ['id', 'username', 'firstname', 'lastname', 'permission', 'printer']}).then(users => {
    res.send({users});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

router.post('/', function(req, res) {
  const io = req.app.get('io');
  db.User.create(serialize(req.body.user)).then(user => {
    res.send({user});
    io.sockets.emit("update", {user});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

router.put('/:id', function(req, res) {
  const io = req.app.get('io');
  db.User.find({where: {id: req.params.id}}).then(user => {
    if (user === null) throw new Error('user not found');
    return user.update(serialize(req.body.user));
  }).then(user => {
    res.send({user});
    io.sockets.emit("update", {user});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

router.delete('/:id', function(req, res) {
  const io = req.app.get('io');
  db.User.find({where: {id: req.params.id}}).then(user => {
    if (user === null) throw new Error('user not found');
    return user.destroy();
  }).then(() => {
    res.send({});
    io.sockets.emit("delete", {'type': 'user', 'id': user.id});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

module.exports = router;
