const socketTest       = require("./integration/socket.test");
const apiTest          = require("./integration/api.test");
const authenticateTest = require("./integration/authenticate.test");

const userTest         = require("./integration/user.test");
const unitTest         = require("./integration/unit.test");

module.exports  = function(){
  authenticateTest();
  apiTest();
  socketTest();

  userTest();
  unitTest();
};
