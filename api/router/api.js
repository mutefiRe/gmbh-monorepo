'use strict';

const express          = require('express');
const router           = express.Router();
const jwt              = require('jsonwebtoken');
const config           = require('../config/config');

const userPath         = require('./user.js');
const categoryPath     = require('./category');
const organizationPath = require('./organization.js');
const settingPath      = require('./setting.js');
const unitPath         = require('./unit.js');
const itemPath         = require('./item.js');
const orderItemPath    = require('./orderitem.js');
const orderPath        = require('./order.js');
const tablePath        = require('./table.js');
const areaPath         = require('./area.js');
const printPath        = require('./print.js');
const printerPath      = require('./printer.js');

router.use(function(req, res, next) {

  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, config.secret, function(error, decoded) {

      if (error) {
        return res.status(400).send({
          'errors': {
            'msg': error.message
          }
        });
      }
      req.decoded = decoded;
      next();
    });

  } else {
    res.status(400).send({
      'errors': {
        "msg": "No token provided"
      }
    });
  }
});

router.use('/prints', printPath);
router.use('/printers', printerPath);
router.use('/users', userPath);
router.use('/orders', orderPath);
router.use('/orderItems', orderItemPath);
router.use('/categories', categoryPath);
router.use('/organizations', organizationPath);
router.use('/settings', settingPath);
router.use('/items', itemPath);
router.use('/units', unitPath);
router.use('/tables', tablePath);
router.use('/areas', areaPath);
router.get('/', function(req, res){
  res.status(200).send({"msg": "you have access to the api"});
});

module.exports = router;
