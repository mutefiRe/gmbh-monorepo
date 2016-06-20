'use strict'

const express = require('express');
const server = require('http').Server(express);
const io = require('socket.io')(server);
const router = express.Router();
const printer = require('printer/lib');

router.use(function timeLog(req, res, next){
  //console.log('Time: ', Date.now());
  next();
})

router.get('/:printer', function(req, res){
  const printers = printer.getPrinters();
  /*
  for (let p of printers){
    if (req.params.printer == p)
    {
      res.send("printer": {
        name:p
      })
    }
  }*/
})

router.get('/', function(req, res){
  const printers = printer.getPrinters();
  for (let i = 0; i < printers.length; i++){
    printers[i].id = i + 1;
    delete printers[i].jobs;
  }
  res.status(200).send({"printer" : printers})
})

module.exports = router;
