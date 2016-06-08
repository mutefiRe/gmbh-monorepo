"use strict";

const fs = require('fs');
const db = require('./models/index');



class Print {

  constructor(printername, length) {
    this.printername = printername;
    this.length = length;
  }
  printOrder(data){
    console.log("ORDER before", data)
    let order = this.transformOrder(data);
    console.log("ORDER DATA", order);
  }

  transformOrder(data){
    let tmp = {};
    let order;
    let orderitem;
    for(let key in data.Orderitems)
    {
     orderitem = data.Orderitems[key]
     if (tmp[orderitem.ItemId + "_" + orderitem.extras]) {
      tmp[orderitem.ItemId + "_" + orderitem.extras].cnt = tmp[orderitem.ItemId + "_" + orderitem.extras].cnt + 1;
    }
    else
    {
      tmp[orderitem.ItemId + "_" + orderitem.extras] = orderitem;
      tmp[orderitem.ItemId + "_" + orderitem.extras].cnt = 1;
    }
  }
  order = data;
  order.Orderitems = tmp;
  return order;
}

formatDate(){

}
formatOrderItem(){

}


}

module.exports = new Print();
