'use strict';

module.exports = function(data){
  const orderitem = {
    extras: data.extras,
    orderId: data.order,
    itemId: data.item,
    count:     data.count,
    countPaid: data.countPaid,
    countFree: data.countFree,
    price:     data.price
  };
  return orderitem;
};
