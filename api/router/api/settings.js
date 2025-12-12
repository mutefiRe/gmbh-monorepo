'use strict';

const router = require('express').Router();
const db = require('../../models');

/**
 * @apiDefine settingAttributes
 * @apiSuccess {Number}  settings.id Autoincremented Identifier of the setting
 * @apiSuccess {String}  settings.name
 * @apiSuccess {Date}  settings.beginDate
 * @apiSuccess {Date}  settings.endDate
 * @apiSuccess {Boolean}  settings.instantPay
 * @apiSuccess {Boolean}  settings.customTables
 * @apiSuccess {String}  settings.receiptPrinter
 * @apiSuccess {String}  settings.expiresTime
 * @apiSuccess {Boolean}  settings.itemShowPrice
 */

/**
 * @apiDefine settingParams
 * @apiParam {Number}  settings.id
 * @apiParam {String}  settings.name
 * @apiParam {String}  settings.beginDate
 * @apiParam {Number}  settings.endDate
 * @apiParam {Boolean}  settings.instantPay
 * @apiParam {Boolean}  settings.CustomTables
 * @apiSuccess {String}  settings.receiptPrinter
 * @apiSuccess {String}  settings.expiresTime
 * @apiSuccess {Boolean}  settings.itemShowPrice
 */

/**
 * @api {get} api/settings/:id Request Setting
 * @apiGroup Setting
 * @apiName GetSetting
 * @apiParam {number} string Settings unique ID.

  *@apiUse token

 * @apiSuccess {Object} settings Setting
 * @apiUse settingAttributes

 * @apiPermission waiter
 * @apiPermission admin
 */

router.get('/:id', function (req, res) {
  db.Setting.findOne({ where: { id: req.params.id } }).then(setting => {
    if (setting === null) {
      res.status(404).send({
        'errors': {
          'msg': "couldn't find any settings"
        }
      });
      return;
    }
    res.send({ setting });
  });
});

/**
 * @api {get} api/settings Request all settings
 * @apiGroup Setting
 * @apiName Getsettings

 * @apiParam {string} x-access-token JSONWebToken | Mandatory if not set as header
 * @apiHeader {string} x-access-token JSONWebToken | Mandatory if not in params

 * @apiSuccess {Object[]} settings Setting
 * @apiUse settingAttributes

 * @apiPermission waiter
 * @apiPermission admin
 */

router.get('/', function (req, res) {
  db.Setting.findAll().then(setting => {
    if (setting[0] === undefined) {
      res.status(404).send({
        'errors': {
          'msg': "couldn't find any settings"
        }
      });
      return;
    }
    res.send({ setting });
  });
});

/**
 * @api {post} api/settings/ Create one setting
 * @apiGroup Setting
 * @apiName PostSetting
 * @apiUse token
 * @apiParam {Object} settings
 * @apiUse settingParams
 * @apiUse settingAttributes
 *
 * @apiPermission admin
 */

router.post('/', function (req, res) {
  const io = req.app.get('io');
  db.Setting.create(req.body.setting).then(setting => {
    res.send({ setting });
    io.sockets.emit("update", { setting });
  }).catch(err => {
    res.status(400).send({
      'errors': {
        'msg': err.errors[0].message
      }
    });
  });
});

/**
 * @api {put} api/settings/:id Update one setting
 * @apiGroup Setting
 * @apiName UpdateSetting
 * @apiUse token
 * @apiParam {Object} settings
 * @apiParam {number} string
 * @apiUse settingParams
 * @apiSuccess {Object} settings
 * @apiUse settingAttributes
 *
 * @apiPermission admin
 */

router.put('/:id', function (req, res) {
  const io = req.app.get('io');
  db.Setting.findOne({ where: { id: req.params.id } }).then(setting => {
    if (setting === null) {
      res.status(404).send({
        'errors': {
          'msg': "couldn't find any settings"
        }
      });
      return;
    }
    setting.update(req.body.setting).then(setting => {
      res.send({ setting });
      io.sockets.emit("update", { setting });
    }).catch(err => {
      res.status(400).send({
        'errors': {
          'msg': err.errors[0].message
        }
      });
    });
  });
});

/**
 * @api {delete} api/settings/:id Delete one setting
 * @apiGroup Setting
 * @apiName DeleteSetting
 * @apiParam {number} string Id
 *
 * @apiPermission admin
 * @apiSuccess {object} object empty Object {}
 */

router.delete('/:id', function (req, res) {
  db.Setting.findOne({ where: { id: req.params.id } }).then(setting => {
    if (setting === null) {
      res.status(404).send({
        'errors': {
          'msg': "could not find any settings"
        }
      });
      return;
    }
    setting.destroy().then(() => {
      res.send({});
    });
  });
});

module.exports = router;
