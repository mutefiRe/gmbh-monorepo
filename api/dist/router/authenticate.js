"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config = require('../config/config');
const index_1 = __importDefault(require("../models/index"));
const router = (0, express_1.Router)();
router.post('/', function (req, res) {
    index_1.default.User.findOne({
        where: {
            username: req.body.username
        }
    }).then(thisUser => {
        if (!thisUser)
            throw new Error("auth.error");
        else if (thisUser.validPassword(req.body.password)) {
            index_1.default.Setting.findOne()
                .then((setting) => {
                const expiresTime = setting?.expiresTime || "72h";
                const tokenPayload = thisUser.createAuthUser({
                    eventId: setting?.activeEventId || null
                });
                const token = jsonwebtoken_1.default.sign(tokenPayload, config.secret, { expiresIn: expiresTime });
                res.send({ token });
            });
        }
        else
            throw new Error("auth.error");
    }).catch(error => {
        res.status(401).send({
            'errors': {
                'msg': error && error.errors && error.errors[0].message || error.message
            }
        });
    });
});
// should render the user name
router.get("/", function (req, res) {
    const cookies = req.cookies || {};
    const token = cookies['x-gmbh-token'];
    if (!token) {
        return res.status(401).send(`
      <html>
        <body>
          <p>You are not logged in.</p>
          <a href="/authenticate/login">Login</a>
        </body>
      </html>
    `);
    }
    jsonwebtoken_1.default.verify(token, config.secret, function (error, decoded) {
        if (error) {
            return res.status(401).send(`
        <html>
          <body>
            <p>Your session has expired or is invalid.</p>
            <a href="/authenticate/login">Login</a>
          </body>
        </html>
      `);
        }
        res.send(`
      <html>
        <body>
          <p>Welcome, ${decoded.username}!</p>
          <a href="/authenticate/logout">Logout</a>
        </body>
      </html>
    `);
    });
});
router.get("/login", function (req, res) {
    // if logged in already render a logout page
    const cookies = req.cookies || {};
    if (cookies['x-gmbh-token']) {
        return res.send(`
      <html>
        <body>
          <form method="GET" action="/authenticate/logout">
            <button type="submit">Logout</button>
          </form>
        </body>
      </html>
    `);
    }
    // render a login page which will send post request to /authenticate
    res.send(`
    <html>
      <body>
        <form method="POST" action="/authenticate">
          <label for="username">Username:</label>
          <input type="text" id="username" name="username" required />
          <br/>
          <label for="password">Password:</label>
          <input type="password" id="password" name="password" required />
          <br/>
          <button type="submit">Login</button>
        </form>
      </body>
    </html>
  `);
});
router.get("/logout", function (req, res) {
    res.cookie('x-gmbh-token', '', {
        httpOnly: true,
        sameSite: 'lax',
        // secure: true, // Uncomment if using HTTPS
        maxAge: 0 // Expire the cookie immediately
    });
    res.send(`
      <html>
        <body>
          <p>You have been logged out.</p>
          <a href="/authenticate/login">Login again</a>
        </body>
      </html>
    `);
});
module.exports = router;
