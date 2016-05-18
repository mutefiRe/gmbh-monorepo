'use strict'

const serverTest = require("./server.test")
const routeTest = require("./route.test")
const userTest = require("./user.test")
const apiTest = require("./api.test")
const authenticateTest = require("./authenticate.test")
const db = require('../models/index');

authenticateTest();
userTest();
apiTest();
