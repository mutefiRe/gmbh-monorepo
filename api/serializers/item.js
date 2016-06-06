'use strict'

module.exports = function(data){
  let item = {
    name : data.name,
    amount : data.amount,
    price : data.price,
    tax : data.tax,
    CategoryId : data.category,
    UnitId : data.unit
  }
  return item;
}
