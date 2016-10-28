const socketTest       = require("./integration/socket.test");
const userTest         = require("./integration/user.test");
const apiTest          = require("./integration/api.test");
const authenticateTest = require("./integration/authenticate.test");

module.exports  = function(){
  userTest();
  authenticateTest();
  apiTest();
  socketTest();
}
