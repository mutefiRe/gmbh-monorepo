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
const path = require('path');



router.use(function timeLog(req, res, next){
  next();
})

router.get('/', function(req, res){
  db.Orderitem.findAll({include: [{model: db.Item, include: [db.Category]}]}).then(data =>
  {
    let Orderitems = JSON.parse(JSON.stringify(data));

    let csvItems = {};

    let writer = csvWriter({ headers: ["Produkt", "Verkauft","davon Frei", "Verdienst"]});
    writer.pipe(fs.createWriteStream('products.csv'));

    for(let Orderitem in Orderitems){
      let freecount = 0;

      if(Orderitems[Orderitem].forFree){ freecount = 1; }
      if(!csvItems[Orderitems[Orderitem].item.name+' '+Orderitems[Orderitem].item.amount]){
        csvItems[Orderitems[Orderitem].item.name+' '+Orderitems[Orderitem].item.amount] = {count : 1, price: Orderitems[Orderitem].item.price, freecount : freecount};
      }else{
        csvItems[Orderitems[Orderitem].item.name+' '+Orderitems[Orderitem].item.amount].count++;
        if(!freecount){
          csvItems[Orderitems[Orderitem].item.name+' '+Orderitems[Orderitem].item.amount].price += Orderitems[Orderitem].item.price;
        }
        csvItems[Orderitems[Orderitem].item.name+' '+Orderitems[Orderitem].item.amount].freecount += freecount;

      }
    }

    for(let item in csvItems){
      writer.write([item,csvItems[item].count, csvItems[item].freecount, csvItems[item].price]);
    }
    writer.end();

    let writer2 = csvWriter({ headers: ["Kategorie", "Verkauft","davon Frei", "Verdienst"]});
    writer2.pipe(fs.createWriteStream('categories.csv'));

    csvItems = {};
    for(let Orderitem in Orderitems){
      let category = Orderitems[Orderitem].item.category;
      let freecount = 0;
      if(Orderitems[Orderitem].forFree){ freecount = 1; }
      if(!csvItems[category.name]){
        csvItems[category.name] = {count : 1, price: Orderitems[Orderitem].item.price, freecount : freecount};
      }else{
        csvItems[category.name].count++;
        if(!freecount){
          csvItems[category.name].price += Orderitems[Orderitem].item.price;
        }
        csvItems[category.name].freecount += freecount;
      }
    }



    for(let item in csvItems){
      writer2.write([item,csvItems[item].count, csvItems[item].freecount, csvItems[item].price]);
    }
    writer2.end();







    res.send("Erfolgreich erstellt!");
  })
})



module.exports = router;
