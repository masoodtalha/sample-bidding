/**
 * Created by lmandadapu on 1/21/16.
 */
module.exports = function (app) {

  var Alert = app.models.Alert;
  var async =  require('async');

  Alert.find({user: req.params.id})
    .sort({read: 1})
    .exec(function(err, alerts) {
      if(err){
        return app.responder.send(400, res, 'Bad Request', err);
      }
      else{
        return app.responder.send(200, res, 'Success', alerts);
      }
    });

  var seed = function(req, res) {
    var dummyDataDescription = ["Alert 1"];
    async.each(dummyDataDescription, function(description, callback){
      var obj = {
        name: description,
        description: description
      };

      if(req.body.userID){
        obj.user = req.body.userID;
      }
      Alert.create(obj, function (err) {
        if(err){
          callback(err);
        }
        else{
          callback();
        }
      })
    },  function(err){
      if (err){
        app.responder.send(500, res, 'Server Error', err);
      }
      else{
        app.responder.send(200, res, 'Alerts Successfully Seeded', null);
      }
    });
  };


};