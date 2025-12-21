'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
router.post('/', function (req, res) {
    console.error(`Ember Error in ${req.body.app} with message: "${req.body.message}"`); //eslint-disable-line
    res.status(200).send({});
});
module.exports = router;
