'use strict';

module.exports = function(data){
  const order = {
    totalAmount: data.totalAmount,
    userId: data.user,
    tableId: data.table,
    orderitems: data.orderitems
  };
  return order;
};
