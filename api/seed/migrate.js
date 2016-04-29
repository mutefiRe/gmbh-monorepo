'use strict'

const db = require('../models/index');

db.sequelize.sync({force:true})
