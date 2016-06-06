'use strict'

module.exports = function(data){
  let table = {
    name: data.name,
    x: data.x,
    y: data.y,
    AreaId: data.area
  }
  return table;
}
