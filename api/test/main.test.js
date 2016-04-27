const serverTest = require("./server.test")
const routeTest = require("./route.test")
const userTest = require("./user.test")
const authenticateTest = require("./authenticate.test")

    db.User.create({
      username: "testUser",
      firstname: "max",
      lastname: "mustermann",
      password: "testPW",
      permission: 1,
      token: "abc123"
    })

serverTest();
routeTest();
userTest();
authenticateTest();
