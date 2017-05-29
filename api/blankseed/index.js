'use strict';

const seed = require('./seed');
const db = require('../models/index');

db.sequelize.sync({force:true}).then(() => {
  seed().then(() => {
    db.sequelize.close();
  });
});
