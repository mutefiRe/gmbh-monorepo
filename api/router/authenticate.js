'use strict';

const express = require('express');
const router = express.Router();
const db = require('../models/index');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js');

/**
 * @api {post} authenticate/ Get token for user
 * @apiGroup Authentication
 * @apiName Authentication
 * @apiParam {String} username
 * @apiParam {String} password
 * @apiSuccess {String} token JSONWebToken
 */

router.post('/', function (req, res) {
  db.User.findOne({
    where: {
      username: req.body.username
    }
  }).then(thisUser => {
    if (!thisUser) throw new Error("auth.error");
    else if (thisUser.validPassword(req.body.password)) {
      db.Setting.findAll().then((settings) => {
        return JSON.parse(JSON.stringify(settings))[0].expiresTime;
      }).then((expiresTime) => {
        const token = jwt.sign(thisUser.createAuthUser(), config.secret, { expiresIn: expiresTime || "72h" });
        res.cookie('x-gmbh-token', token, {
          httpOnly: true,
          sameSite: 'lax',
          // secure: true, // Uncomment if using HTTPS
          maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days in ms
        });
        res.send({ token });
      });
    }
    else throw new Error("auth.error");
  }).catch(error => {
    res.status(400).send({
      'errors': {
        'msg': error && error.errors && error.errors[0].message || error.message
      }
    });
  });
});

// should render the user name
router.get("/", function (req, res) {
  const cookies = req.cookies || req.cookie || {};
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

  jwt.verify(token, config.secret, function (error, decoded) {
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

  const cookies = req.cookies || req.cookie || {};
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
