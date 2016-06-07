'use strict'

module.exports = function(data){
  console.log(data);
  let orderitem = {
    extras: data.extras,
    isPaid: data.isPaid,
    OrderId: data.order,
    ItemId: data.item
  }
  return orderitem;
}
