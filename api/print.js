"use strict";

const fs = require('fs');
const db = require('./models/index');



class Print {

  constructor(printername, length) {
    this.printername = printername;
    this.length = length;
  }
  printOrder(data){
   let order = this.transformOrder(data);
   console.log("ORDER DATA", order);
 }

 transformOrder(data){
  let tmp = {};
  for(let key in data.Orderitems)
  {
   orderitem = data.Orderitems[key]
   if (tmp[orderitem.id + "_" + orderitem.extra]) {
    tmp[orderitem.id + "_" + orderitem.extras].cnt = tmp[orderitem.id + "_" + orderitem.extras].cnt + 1;
  }
  else
  {
    tmp[orderitem.id + "_" + orderitem.extras] = orderitem;
    tmp[orderitem.id + "_" + orderitem.extras].cnt = 1;
  }
}
return tmp;
}

formatDate(){

}
formatOrderItem(){

}


}

module.exports = new Print();
