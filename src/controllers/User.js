module.exports = function(app) {
  var _ = require('underscore');
  var fs = require('fs');
  var async = require('async');
  var crypto = require('crypto');
  var bcrypt = require('bcrypt-nodejs');
  //  var bcrypt = require('bcrypt');
  var path = require('path');
  var uuid = require('node-uuid');
  var moment = require('moment-timezone');
  var sessionUtil = require("../utils/session");
  // var mkdirp	=	require('mkdirp');
  var underscoreDeepExtend = require('underscore-deep-extend');
  var User = app.models.User;
  var Inventory = app.models.Inventory;
  var Token = app.models.Token;

  var _responder = app.responder;

  var _breads = 30;
  var _carrots = 18;
  var _diamonds = 1;

  var Controller = {
    name: User.name
  };

  var _errorParse = function(errorJson) {
    var errorName = errorJson.data.name;

    switch (errorName) {
      case 'SequelizeUniqueConstraintError':
        return {
          alreadyExist: true
        };
        break;
      case '':
        //code block
        break;
      default:
        //default code block
    }
  };

  var _initializeInventory = function(username) {

    var initialInventory = Inventory.db.bulkCreate([{
      username: username,
      productName: 'carrots',
      productType: 'carrots',
      quantity: _carrots
    }, {
      username: username,
      productName: 'breads',
      productType: 'breads',
      quantity: _breads
    }, {
      username: username,
      productName: 'diamonds',
      productType: 'diamonds',
      quantity: _diamonds
    }]);

    return initialInventory;
  };

  Controller.get = function(req, res, next) {
    var users = User.db.find({});

    return app.responder.send(200, res, 'Alert Read Successfully', {}, null);

  };
  //req.body.token = uuid.v4();
  Controller.loginOrRegisterUser = function(req, res, next) {
    var username = req.body.username;
    console.log("bla is: ", req.body.username);
    User.db.findOrCreate({
        where: {
          username: username
        }
      })
      .spread(function(user, created) {
        if (created === true) {
          _initializeInventory(username).then(function(data) {
            sessionUtil.createSession(app, user.id, uuid.v4()).then(
              function(sessionId) {
                return app.responder.send(200, res,
                  'New User Added Successfully', {
                    username: user.username,
                    userId: user.id,
                    sessionId: sessionId
                  }, null);
              },
              function(err) {
                return app.responder.send(404, res, 'System Error',
                  err);
              });
          });
        } else {
          sessionUtil.createSession(app, user.id, uuid.v4()).then(
            function(sessionId) {
              return app.responder.send(200, res,
                'user Already Exists', {
                  username: user.username,
                  userId: user.id,
                  sessionId: sessionId
                }, null);
            },
            function(err) {
              console.log("error");
              return app.responder.send(404, res, 'System Error',
                err);
            });
        }
      })
      .catch(function(err) {
        return app.responder.send(400, res, 'System Error', err);
      });
  };

  Controller.isLoggedIn = function(req, res, next) {
    var Session = app.models.Session.db;
    if (req.headers.authorization !== '') {
      var token = JSON.parse(req.headers.authorization);
      console.log('hey: ', token);
      Session.findOne({
          where: {
            userId: token.userId,
            sessionId: token.sessionId
          }
        })
        .then(function(session) {
          console.log(session.get({
            plain: true
          }));
          if (session) {
            console.log('session found');
            next();
          } else {
            console.log('session not found');
            return res.send(401);
          }
        })
        .catch(function(err) {
          return res.send(401);
        });
    } else {
      return res.send(401);
    }
  };
  Controller.getAllInventoryUser = function(req, res, next) {
    var username = req.params.username;

    Inventory.db.findAll({
      where: {
        'username': username
      },
      attributes: ['productName', 'productType', 'quantity']
    }).then(function(data) {
      return app.responder.send(200, res, 'Inventory Data', data,
        null);
    });
  };

  return Controller;
};
