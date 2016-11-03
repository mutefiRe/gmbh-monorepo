'use strict'

module.exports = function(data){
  let item = {
    name : data.name,
    amount : data.amount,
    price : data.price,
    tax : data.tax,
    categoryId : data.category,
    unitId : data.unit,
    sortId: data.sortId
  }
  return item;
}
