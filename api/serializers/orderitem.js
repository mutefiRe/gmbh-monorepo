'use strict'

module.exports = function(data){
  let orderitem = {
    extras: data.extras || "",
    idPaid: data.isPaid,
    OrderId: data.order,
    ItemId: data.item
  }
  return orderitem;
}
