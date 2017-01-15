'use strict';

module.exports = function(data){
  const table = {
    name: data.name,
    x: data.x,
    y: data.y,
    areaId: data.area,
    custom: data.custom
  };
  return table;
};
