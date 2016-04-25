module.exports = function(app, options) {

  var Sequelize = require('sequelize');
  var User = app.models.User.db;

  var Session = app.db.define('session', {
    sessionId: {
      type: Sequelize.UUID,
      primaryKey: true,
      field: 'sessionId',
    }
  });
  Session.belongsTo(User);
  Session.sync();
  return {
    name: 'Session',
    db: Session
  };
};
