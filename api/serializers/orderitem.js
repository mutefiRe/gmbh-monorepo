'use strict'

module.exports = function(data){
  let order = {
    extras: data.extras || "",
    idPaid: data.isPaid,
    OrderId: data.order,
    ItemId: data.item
  }
  return order;
}
