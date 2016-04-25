module.exports = function(app, options) {

  var Sequelize = require('sequelize');
  var User = app.db.define('user', {
    username: {
      type: Sequelize.STRING,
      field: 'username',
      unique: true
    }
  });
  User.sync();
  return {
    name: 'User',
    db: User
  };
};
