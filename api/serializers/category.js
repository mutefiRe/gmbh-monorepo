'use strict';

module.exports = function(data){
  const category = {
    name : data.name,
    enabled : data.enabled,
    description : data.description,
    icon : data.icon,
    showAmount : data.showAmount,
    categoryId : data.category,
    printer: data.printer
  };
  return category;
};
