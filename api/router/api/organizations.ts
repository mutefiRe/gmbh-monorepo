'use strict';

const router = require('express').Router();
const db = require('../../models');

router.get('/:id', function (req, res) {
  db.Organization.findOne({ where: { id: req.params.id, eventId: req.eventId } }).then(organization => {
    if (organization === null) {
      res.status(404).send({
        'errors': {
          'msg': "organization not found"
        }
      });
      return;
    }
    res.send({ organization });
  });
});

router.get('/', function (req, res) {
  db.Organization.findAll({ where: { eventId: req.eventId } }).then(organizations => {
    if (organizations[0] === undefined) {
      res.status(404).send({
        'errors': {
          'msg': "organizations not found"
        }
      });
      return;
    }
    res.send({ organizations });
  });
});

router.post('/', function (req, res) {
  const io = req.app.get('io');
  db.Organization.create({ ...req.body.organization, eventId: req.eventId }).then(organization => {
    io.sockets.emit("update", { organization, eventId: req.eventId });
    res.send({ organization });
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
  db.Organization.findOne({ where: { id: req.params.id, eventId: req.eventId } }).then(organization => {
    if (organization === null) {
      res.status(404).send({
        'errors': {
          'msg': "organizations not found"
        }
      });
      return;
    }
    organization.update({ ...req.body.organization, eventId: req.eventId }).then(data => {
      res.send({ organization: data });
      io.sockets.emit("update", { organization: data, eventId: req.eventId });
    }).catch(error => {
      res.status(400).send({
        'errors': {
          'msg': error && error.errors && error.errors[0].message || error.message
        }
      });
    });
  });
});

router.delete('/:id', function (req, res) {
  const io = req.app.get('io');
  db.Organization.findOne({ where: { id: req.params.id, eventId: req.eventId } }).then(organization => {
    if (organization === null) {
      res.status(404).send({
        'errors': {
          'msg': "organization not found"
        }
      });
      return;
    }
    organization.destroy().then(() => {
      res.send({});
      io.sockets.emit("delete", { 'type': 'organization', 'id': organization.id, eventId: req.eventId });
    });
  });
});

module.exports = router;
