'use strict'

const express = require('express');
const server = require('http').Server(express);
const io = require('socket.io')(server);
const router = express.Router();
const db = require('../models/index');
const serialize = require('../serializers/order');
const print = require('../print.js');
const csvWriter = require('csv-write-stream');
const fs = require('fs');



router.use(function timeLog(req, res, next){
  //console.log('Time: ', Date.now());
  next();
})

router.get('/', function(req, res){
  db.Orderitem.findAll({include: [{model: db.Item}]}).then(data =>
  {
    let Orderitems = JSON.parse(JSON.stringify(data));

    let csvItems = {};

    let writer = csvWriter({ headers: ["Produkt", "Anzahl", "Verdienst"]});
    writer.pipe(fs.createWriteStream('out.csv'));

    for(let Orderitem in Orderitems){
      if(!csvItems[Orderitems[Orderitem].Item.name+' '+Orderitems[Orderitem].Item.amount]){
        csvItems[Orderitems[Orderitem].Item.name+' '+Orderitems[Orderitem].Item.amount] = {count : 1, price: Orderitems[Orderitem].Item.price};
      }else{
        csvItems[Orderitems[Orderitem].Item.name+' '+Orderitems[Orderitem].Item.amount].count++;
        csvItems[Orderitems[Orderitem].Item.name+' '+Orderitems[Orderitem].Item.amount].price += Orderitems[Orderitem].Item.price;
      }
    }

    for(let item in csvItems){
      writer.wrtie([item,csvItems[item].count,csvItems[item].price]);
    }

    console.log(csvItems);

    writer.end();

    res.send({'items': Orderitems});
  })
})

module.exports = router;
