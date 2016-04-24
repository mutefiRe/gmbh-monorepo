var Sequelize = require('sequelize');
var sequelize = new Sequelize('gmbh', 'root', '',
{
  host: "localhost",
  port: 3306
});
User = sequelize.define('user', {
  username: {type: Sequelize.STRING, allowNull: false,  unique: true},
  firstname: {type: Sequelize.STRING, allowNull: false,  unique: false},
  lastname: {type: Sequelize.STRING, allowNull: false,  unique: false},
  password: {type: Sequelize.STRING, allowNull: false,  unique: false},
  rights: {type: Sequelize.INTEGER, allowNull:false, unique: false}
})

exports.User = User;