'use strict'

module.exports = function(data){
  let user = {
    username: data.username,
    firstname: data.firstname,
    lastname: data.lastname,
    permission: data.permission,
    password: data.password
  }
  return user;
}
