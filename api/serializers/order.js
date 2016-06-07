'use strict'

module.exports = function(data){
  let order = {
    order: {
      totalAmount: data.totalAmount,
      isPaid: data.isPaid || false,
      UserId: data.user,
      TableId: data.table
    },
    orderitems: data.orderitems
  }
  return order;
}
