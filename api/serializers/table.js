'use strict'

module.exports = function(data){
  let table = {
    name: data.name,
    x: data.x,
    y: data.y,
    areaId: data.area
  }
  return table;
}
