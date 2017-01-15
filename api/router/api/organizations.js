'use strict';

const router    = require('express').Router();
const db        = require('../../models');

router.get('/:id', function(req, res){
  db.Organization.find({where: {id: req.params.id}}).then(organization => {
    if(organization === null){
      res.status(404).send({
        'errors': {
          'msg': "organization not found"
        }
      });
      return;
    }
    res.send({organization});
  });
});

router.get('/', function(req, res){
  db.Organization.findAll().then(organizations => {
    if(organizations[0] === undefined){
      res.status(404).send({
        'errors': {
          'msg': "organizations not found"
        }
      });
      return;
    }
    res.send({organizations});
  });
});

router.post('/', function(req, res){
  const io = req.app.get('io');
  db.Organization.create(req.body.organization).then(organization => {
    io.sockets.emit("update", {organization});
    res.send({organization});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

router.put('/:id', function(req, res){
  const io = req.app.get('io');
  db.Organization.find({where: {id: req.params.id}}).then(organization => {
    if(organization === null) {
      res.status(404).send({
        'errors': {
          'msg': "organizations not found"
        }
      });
      return;
    }
    organization.update(req.body.organization).then( data => {
      res.send({organization: data});
      io.sockets.emit("update", {organization: data});
    }).catch(error => {
      res.status(400).send({
        'errors': {
          'msg': error && error.errors && error.errors[0].message || error.message
        }
      });
    });
  });
});

router.delete('/:id', function(req, res){
  const io = req.app.get('io');
  db.Organization.find({where: {id: req.params.id}}).then(organization => {
    if(organization === null){
      res.status(404).send({
        'errors': {
          'msg': "organization not found"
        }
      });
      return;
    }
    organization.destroy().then(() => {
      res.send({});
      io.sockets.emit("delete", {'type': 'organization', 'id': organization.id});
    });
  });
});

module.exports = router;
