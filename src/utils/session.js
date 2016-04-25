var Q = require('q');

exports.createSession = function(app, userId, sessionId) {
  var Session = app.models.Session.db;
  var deferred = Q.defer();
  Session.findOrCreate({
      where: {
        userId: userId
      },
      defaults: {
        sessionId: sessionId
      }
    })
    .spread(function(session, created) {
      var sessionObj = session.get({
        plain: true
      });
      console.log(sessionObj.sessionId);
      if (created === false) {
        Session.update({
          sessionId: sessionId
        }, {
          where: {
            userId: userId
          }
        }).then(function(data) {
          console.log("Session updated: ", sessionId, data.sessionId);
          deferred.resolve(sessionId);
        });
      } else {
        console.log("Session created: ", sessionId, sessionObj.sessionId);
        deferred.resolve(sessionObj.sessionId);
      }
    })
    .catch(function(err) {
      deferred.reject(err);
    });
  return deferred.promise;
};
