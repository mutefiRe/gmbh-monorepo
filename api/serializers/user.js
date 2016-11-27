'use strict';

module.exports = function(data){
  const user = {
    username: data.username,
    firstname: data.firstname,
    lastname: data.lastname,
    permission: data.permission,
    password: data.password,
    printer: data.printer
  };
  return user;
};
