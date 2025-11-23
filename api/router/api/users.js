'use strict';

const router = require('express').Router();
const db = require('../../models');

/**
 * @apiDefine userAttributes
 * @apiSuccess {Number}  users.id Autoincremented Identifier of the user
 * @apiSuccess {String}  users.username Username
 * @apiSuccess {String}  users.firstname Firstname of the user
 * @apiSuccess {String}  users.lastname Lastname of the user
 * @apiSuccess {String}  users.role waiter or admin
 * @apiSuccess {String}  users.printer Printername on the Server
 * @apiSuccess {Number[]}  users.areas Areas assigned to the user
 */

/**
 * @apiDefine userParams
 * @apiParam {Number}  users.id
 * @apiParam {String}  users.username
 * @apiParam {String}  users.firstname
 * @apiParam {String}  users.lastname
 * @apiParam {String}  users.role
 * @apiParam {String}  users.printer
 */

/**
 * @api {get} api/users/:id Request User
 * @apiGroup User
 * @apiName GetUser
 * @apiParam {Number} id Users unique ID.

  *@apiUse token

 * @apiSuccess {Object} users User
 * @apiUse userAttributes

 * @apiPermission waiter
 * @apiPermission admin
 */

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

/**
 * @api {get} api/users Request all users
 * @apiGroup User
 * @apiName GetUsers

 * @apiParam {string} x-access-token JSONWebToken | Mandatory if not set as header
 * @apiHeader {string} x-access-token JSONWebToken | Mandatory if not in params

 * @apiSuccess {Object[]} users User
 * @apiUse userAttributes

 * @apiPermission waiter
 * @apiPermission admin
 */

router.get('/', function (req, res) {
  db.User.findAll({ attributes: ['id', 'username', 'firstname', 'lastname', 'role', 'printerId'], include: [{ model: db.Area }] }).then(users => {
    res.send({ users });
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});


/**
 * @api {post} api/users/ Create one user
 * @apiGroup User
 * @apiName PostUser
 * @apiUse token
 * @apiParam {Object} users
 * @apiUse userParams
 * @apiParam {String} users.password
 *
 * @apiPermission admin
 */

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

/**
 * @api {put} api/users/:id Update one user
 * @apiGroup User
 * @apiName UpdateUser
 * @apiUse token
 * @apiParam {Object} users
 * @apiSuccess {Object} users
 * @apiUse userParams
 * @apiUse userAttributes
 * @apiParam {String} users.password
 * @apiParam {Number} id
 *
 * @apiPermission admin
 */

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

/**
 * @api {delete} api/users/:id Delete one user
 * @apiGroup User
 * @apiName DeleteUser
 * @apiParam {number} id Id
 *
 * @apiPermission admin
 * @apiSuccess {object} object empty Object {}
 */

router.delete('/:id', function (req, res) {
  const io = req.app.get('io');
  db.User.findOne({ where: { id: req.params.id } }).then(user => {
    if (user === null) throw new Error('user not found');
    return user.destroy();
  }).then(() => {
    res.send({});
    io.sockets.emit("delete", { 'type': 'user', 'id': user.id });
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

module.exports = router;
