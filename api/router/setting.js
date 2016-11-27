'use strict';

const express = require('express');
const router = express.Router();
const db = require('../models/index');

router.get('/:id', function(req, res){
  db.Setting.find({where: {id: req.params.id}}).then(setting => {
    if(setting === null){
      res.status(404).send({
        'errors': {
          'msg': "couldn't find any settings"
        }
      });
      return;
    }
    res.send({setting});
  });
});

router.get('/', function(req, res){
  db.Setting.findAll().then(setting => {
    if (setting[0] === undefined) {
      res.status(404).send({
        'errors': {
          'msg': "couldn't find any settings"
        }
      });
      return;
    }
    res.send({setting});
  });
});

router.post('/', function(req, res){
  const io = req.app.get('io');
  db.Setting.create(req.body.setting).then( data => {
    res.send({setting: data});
    io.sockets.emit("update", {setting: data});
  }).catch(err => {
    res.status(400).send({
      'errors': {
        'msg': err.errors[0].message
      }
    });
  });
});

router.put('/:id', function(req, res){
  const io = req.app.get('io');
  db.Setting.find({where: {id: req.params.id}}).then(setting => {
    if(setting === null) {
      res.status(404).send({
        'errors': {
          'msg': "couldn't find any settings"
        }
      });
      return;
    }
    setting.update(req.body.setting).then(setting => {
      res.send({setting});
      io.sockets.emit("update", {setting});
    }).catch(err => {
      res.status(400).send({
        'errors': {
          'msg': err.errors[0].message
        }
      });
    });
  });
});

router.delete('/:id', function(req, res){
  db.Setting.find({where: {id: req.params.id}}).then(setting => {
    if(setting === null){
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
