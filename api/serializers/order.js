 'use strict'

 module.exports = function(data){
  let order = {
    UserId: data.user,
    TableId: data.table
  }
  return order;
}
