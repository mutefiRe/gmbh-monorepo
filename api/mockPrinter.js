"use strict";

const fs = require('fs');
const db = require('./models/index');


class MockPrinter {

  constructor(path) {
    this.path = path;
  }
  print(data){
    db.Order.findById(data, {include: [{model: db.Orderitem, include: [db.Item]}, {model: db.Table}]}).then((order) => {
      fs.writeFile(this.path+"order_"+order.id+".txt", order, (err) => {
        if (err) throw err;
      });
    })
  }
}

module.exports = new MockPrinter("prints/");
