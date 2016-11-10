const db = require('../models/index');

module.exports = {
  clean(done){
    db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
    .then(() => {
      return db.sequelize.sync({force:true});
    }).then(() => {
      return db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    }).then(() => {
      done();
    }).catch(error => {
      done(error);
    });
  }
}
