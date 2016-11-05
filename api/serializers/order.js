'use strict'

module.exports = function(data){
  let order = {
    totalAmount: data.totalAmount,
    isPaid: data.isPaid || false,
    userId: data.user,
    tableId: data.table,
    orderitems: data.orderitems
  }
  return order;
}
