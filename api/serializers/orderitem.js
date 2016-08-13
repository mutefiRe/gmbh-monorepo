'use strict'

module.exports = function(data){
  let orderitem = {
    extras: data.extras,
    isPaid: data.isPaid,
    OrderId: data.order,
    ItemId: data.item,
    forFree: data.forFree
  }
  return orderitem;
}
