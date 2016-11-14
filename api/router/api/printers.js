'use strict'

const express = require('express');
const server = require('http').Server(express);
const io = require('socket.io')(server);
const router = express.Router();
const printer = require('printer/lib');

router.get('/', function(req, res){
  const printers = printer.getPrinters();
  for (let i = 0; i < printers.length; i++){
    printers[i].id = i + 1;
    delete printers[i].jobs;
  }
  res.status(200).send({"printer" : printers})
})

module.exports = router;
