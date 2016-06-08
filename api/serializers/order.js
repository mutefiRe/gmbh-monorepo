'use strict'

module.exports = function(data){
  let order = {
    totalAmount: data.totalAmount,
    isPaid: data.isPaid || false,
    UserId: data.user,
    TableId: data.table
  }
  return order;
}
