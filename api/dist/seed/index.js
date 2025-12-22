'use strict';
const seed = require('./seed');
const blankseed = require('./blankseed');
const devseed = require('./devseed');
const db = require('../models/index');
db.sequelize.sync({ force: true }).then(() => {
    switch (process.argv[2]) {
        case "blank":
            console.log('seeding blankseed');
            blankseed();
            break;
        case "dev":
            console.log("seeding devseed");
            devseed();
            break;
        default:
            console.log('seeding default seed');
            seed();
    }
});
