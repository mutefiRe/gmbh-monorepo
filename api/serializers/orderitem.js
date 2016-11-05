'use strict'

module.exports = function(data){
  let orderitem = {
    extras: data.extras,
    isPaid: data.isPaid,
    orderId: data.order,
    itemId: data.item,
    forFree: data.forFree
  }
  return orderitem;
}
