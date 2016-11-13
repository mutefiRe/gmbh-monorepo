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
  },

  removeTimestamps(body){
    for(const topLevelKey in body){
      if (Array.isArray(body[topLevelKey])){
        for (const record in body[topLevelKey]){
          delete body[topLevelKey][record].createdAt;
          delete body[topLevelKey][record].updatedAt;
        }
      } else {
        for (const key in body[topLevelKey]){
          delete body[topLevelKey].createdAt;
          delete body[topLevelKey].updatedAt;
        }
      }
    }
    return body
  }
};
