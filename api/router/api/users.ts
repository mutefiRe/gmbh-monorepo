'use strict';

const router = require('express').Router();
const db = require('../../models');

router.get('/:id', function (req, res) {
  db.User.findOne({ where: { id: req.params.id }, include: [{ model: db.Area }] }).then(user => {
    if (user) res.send({ user });
    else {
      res.status(404).send({
        'errors': {
          'msg': 'user not found'
        }
      });
    }
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

router.get('/', function (req, res) {
  db.User.findAll({ attributes: ['id', 'username', 'firstname', 'lastname', 'role'], include: [{ model: db.Area }] }).then(users => {
    res.send({ users });
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
  db.User.create(req.body.user).then(user => {
    res.send({ user });
    io.sockets.emit("update", { user });
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

router.put('/:id', function (req, res) {
  const io = req.app.get('io');
  db.User.findOne({ where: { id: req.params.id } }).then(user => {
    if (user === null) throw new Error('user not found');
    if (!req.body.user.password) Reflect.deleteProperty(req.body.user, 'password');
    else req.body.user.password = db.User.generateHash(req.body.user.password);
    return user.update(req.body.user);
  }).then(user => {
    res.send({ user });
    io.sockets.emit("update", { user });
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

router.delete('/:id', async function (req, res) {
  const io = req.app.get('io');
  try {
    const user = await db.User.findOne({ where: { id: req.params.id } });
    if (user === null) {
      throw new Error('user not found');
    }
    const userId = user.id;
    await user.destroy();
    res.send({});
    io.sockets.emit("delete", { type: 'user', id: userId });
  } catch (error) {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  }
});

module.exports = router;
