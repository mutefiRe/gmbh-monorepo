'use strict';

const router = require('express').Router();
const db = require('../../models');


/**
 * @apiDefine organizationAttributes
 * @apiSuccess {Number}  organizations.id Autoincremented Identifier of the organization
 * @apiSuccess {Number}  organizations.uid Unique Identifier of the organization
 * @apiSuccess {String}  organizations.street Id of the Area
 * @apiSuccess {String}  organizations.street_number
 * @apiSuccess {String}  organizations.postalcode
 * @apiSuccess {String}  organizations.city
 * @apiSuccess {String}  organizations.telephone
 */

/**
 * @apiDefine organizationParams
 * @apiParam {Number}  organizations.id Autoincremented Identifier of the organization
 * @apiParam {Number}  organizations.uid Unique Identifier of the organization
 * @apiParam {String}  organizations.street Id of the Area
 * @apiParam {String}  organizations.street_number
 * @apiParam {String}  organizations.postalcode
 * @apiParam {String}  organizations.city
 * @apiParam {String}  organizations.telephone
 */

/**
 * @api {get} api/organizations/:id Request Orangization
 * @apiGroup Orangization
 * @apiName GetOrganization
 * @apiParam {number} string Organizations unique ID.

  *@apiUse token

 * @apiSuccess {Object} organizations Orangization
 * @apiUse organizationAttributes

 * @apiPermission admin
 */

router.get('/:id', function (req, res) {
  db.Organization.findOne({ where: { id: req.params.id } }).then(organization => {
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

/**
 * @api {get} api/organizations Request all organizations
 * @apiGroup Orangization
 * @apiName Getorganizations

 * @apiParam {string} x-access-token JSONWebToken | Mandatory if not set as header
 * @apiHeader {string} x-access-token JSONWebToken | Mandatory if not in params

 * @apiSuccess {Object[]} organizations Orangization
 * @apiUse organizationAttributes

 * @apiPermission admin
 */

router.get('/', function (req, res) {
  db.Organization.findAll().then(organizations => {
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

/**
 * @api {post} api/organizations/ Create one organization
 * @apiGroup Orangization
 * @apiName PostOrangization
 * @apiUse token
 * @apiParam {Object} organizations
 * @apiUse organizationParams
 * @apiUse organizationAttributes
 *
 * @apiPermission admin
 */

router.post('/', function (req, res) {
  const io = req.app.get('io');
  db.Organization.create(req.body.organization).then(organization => {
    io.sockets.emit("update", { organization });
    res.send({ organization });
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

/**
 * @api {put} api/organizations/:id Update one organization
 * @apiGroup Orangization
 * @apiName UpdateOrangization
 * @apiUse token
 * @apiParam {Object} organizations
 * @apiSuccess {Object} organizations
 * @apiUse organizationParams
 * @apiUse organizationAttributes
 *
 * @apiPermission admin
 */

router.put('/:id', function (req, res) {
  const io = req.app.get('io');
  db.Organization.findOne({ where: { id: req.params.id } }).then(organization => {
    if (organization === null) {
      res.status(404).send({
        'errors': {
          'msg': "organizations not found"
        }
      });
      return;
    }
    organization.update(req.body.organization).then(data => {
      res.send({ organization: data });
      io.sockets.emit("update", { organization: data });
    }).catch(error => {
      res.status(400).send({
        'errors': {
          'msg': error && error.errors && error.errors[0].message || error.message
        }
      });
    });
  });
});

/**
 * @api {delete} api/organizations/:id Delete one organization
 * @apiGroup Orangization
 * @apiName DeleteOrangization
 * @apiParam {number} string Id
 *
 * @apiPermission admin
 * @apiSuccess {object} object empty Object {}
 */

router.delete('/:id', function (req, res) {
  const io = req.app.get('io');
  db.Organization.findOne({ where: { id: req.params.id } }).then(organization => {
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
      io.sockets.emit("delete", { 'type': 'organization', 'id': organization.id });
    });
  });
});

module.exports = router;
