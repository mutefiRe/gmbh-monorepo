'use strict';

const router = require('express').Router();
const db     = require('../../models');

/**
 * @apiDefine categoryAttributes
 * @apiSuccess {Number}  categories.id Autoincremented Identifier of the category
 * @apiSuccess {String}  categories.name Name of the category
 * @apiSuccess {Boolean}  categories.enabled Flag if the Category is enabled
 * @apiSuccess {String}  categories.description
 * @apiSuccess {String}  categories.icon identifier of the icon shown for the category
 * @apiSuccess {Boolean}  categories.showAmount Flag if the Amount and Unit is shown in the item
 * @apiSuccess {String}  categories.printer Dedicaded Printer (where orders of this categories should be printed)
 * @apiSuccess {Number} categories.çategory Parentcategory
 */

/**
 * @apiDefine categoryParams
 * @apiParam {Number}  categories.id Autoincremented Identifier of the category
 * @apiParam {String}  categories.name Name of the category
 * @apiParam {Boolean}  categories.enabled Flag if the Category is enabled
 * @apiParam {String}  categories.description
 * @apiParam {String}  categories.icon identifier of the icon shown for the category
 * @apiParam {Boolean}  categories.showAmount Flag if the Amount and Unit is shown in the item
 * @apiParam {String}  categories.printer Dedicaded Printer (where orders of this categories should be printed)
 * @apiParam {Number[]} categories.categories Subcategories
 * @apiParam {Number} categories.çategory Parentcategory
 */

/**
 * @api {get} api/categories/:id Request Category
 * @apiGroup Category
 * @apiName GetCategory
 * @apiParam {Number} id Categorys unique ID.

  *@apiUse token

 * @apiSuccess {Object} categories Category
 * @apiUse categoryAttributes

 * @apiPermission waiter
 * @apiPermission admin
 */

router.get('/:id', function(req, res){
  db.Category.find({where: {id: req.params.id}}).then(category => {
    res.send({category});

  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

/**
 * @api {get} api/categories Request all categories
 * @apiGroup Category
 * @apiName Getcategories

 * @apiParam {string} x-access-token JSONWebToken | Mandatory if not set as header
 * @apiHeader {string} x-access-token JSONWebToken | Mandatory if not in params

 * @apiSuccess {Object[]} categories Category
 * @apiUse categoryAttributes

 * @apiPermission waiter
 * @apiPermission admin
 */

router.get('/', function(req, res) {
  db.Category.findAll().then(categories => {
    res.send({categories});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

/**
 * @api {post} api/categories/ Create one category
 * @apiGroup Category
 * @apiName PostCategory
 * @apiUse token
 * @apiParam {Object} categories
 * @apiSuccess {Object} categories
 * @apiUse categoryParams
 * @apiUse categoryAttributes
 *
 * @apiPermission waiter
 * @apiPermission admin
 */

router.post('/', function(req, res){
  const io = req.app.get('io');
  db.Category.create(req.body.category).then(category => {
    res.send({category});
    io.sockets.emit("update", {category});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

/**
 * @api {put} api/categories/:id Update one category
 * @apiGroup Category
 * @apiName UpdateCategory
 * @apiUse token
 * @apiParam {Object} categories
 * @apiSuccess {Object} categories
 * @apiUse categoryParams
 * @apiUse categoryAttributes
 *
 * @apiPermission waiter
 * @apiPermission admin
 */

router.put('/:id', function(req, res){
  const io = req.app.get('io');
  db.Category.find({where: {id: req.params.id}})
  .then(category => {
    if (category === null) throw new "category not found";
    return category.update(req.body.category);
  }).then(category => {
    res.send({category});
    io.sockets.emit("update", {category});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

/**
 * @api {delete} api/categories/:id Delete one category
 * @apiGroup Category
 * @apiName DeleteCategory
 * @apiParam {number} id Id
 *
 * @apiPermission waiter
 * @apiPermission admin
 * @apiSuccess {object} object empty Object {}
 */

router.delete('/:id', function(req, res){
  const io = req.app.get('io');
  db.Category.find({where: {id: req.params.id}}).then(category => {
    if (category === null) throw new "category not found";
    return category.destroy();
  }).then(category => {
    res.send({});
    io.sockets.emit("delete", {'type': 'category', 'id': category.id});
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

module.exports = router;
