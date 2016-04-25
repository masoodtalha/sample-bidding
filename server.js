var express = require("express");
var fs = require("fs");
var nconf = require("nconf");
var path = require("path");
var util = require("util");
var controllers = require("./src/controllers");

var models = require("./src/models");
var responder = require("./src/utils/responder");
var routes = require("./src/routes");
var EventEmitter = require('events').EventEmitter;
var i18n = require("i18n");
var http = require('http');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var Sequelize = require('sequelize');
var compress = require('compression');

var Server = function Server(config) {
  var app, db;

  if (config.get("newrelic")) {
    this.setupNewRelic(config);
  }

  app = module.exports = express();
  app.config = config;
  db = app.db = new Sequelize(app.config.get("db:database"), app.config.get(
      "db:username"),
    app.config.get("db:password"), {
      host: app.config.get("db:host"),
      dialect: app.config.get("db:dialect"),

      pool: {
        max: 5,
        min: 0,
        idle: 10000
      },
    });
  app.events = new EventEmitter();

  app.getDB = function(schemaName) {
    return db;
  };

  this.setupLogging(app);

  // Middleware
  app.auditlogger = require("./src/utils/auditlogger")(app);

  app.use(app.auditlogger);
  app.use(morgan('combined'));
  app.use(compress());

  function skipJsonCheck(res, path) {
    // don't check json conetent type for specific types
    //if(/\.jpg|\.ico|\.png|\.map|\.gif|\.js|\.css|\.html|\.svg|\.woff|\.ttf/.test(path.toLowerCase())){
    //    return true;
    //} else if(path.endsWith('/picture')){
    //    return true;
    //} else {
    //  res.setHeader('Content-Type', 'application/json');
    //  return false;
    //}
  }

  // cross-site scripting XSS -  accept content-type header of application/json
  app.use(function(req, res, next) {
    var content_type = "";
    if (req.headers['content-type'] !== undefined) {
      content_type = req.headers['content-type'];
    } else if (req.headers['Content-Type'] !== undefined) {
      content_type = req.headers['Content-Type'];
    }
    app.log.debug("req.path ::" + req.path + " :: content-type:" +
      content_type + " :: req.method :" + req.method);

    var skipJson = skipJsonCheck(res, req.path);
    if (skipJson) {
      next();
    } else {

      var is_json = /json/i.test(content_type),
        is_multipart = /multipart/i.test(content_type);

      if ('GET' === req.method || 'DELETE' === req.method || is_multipart ||
        is_json) {
        next();
      } else {
        app.responder.send(401, res,
          'Only accepts content-type header as application/json');
      }
    }
  });

  i18n.configure({
    locales: ["en"],
    directory: path.join(__dirname, "locales"),
    updateFiles: false
  });
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(bodyParser.json());
  app.use(methodOverride('X-HTTP-Method-Override'));

  app.i18n = i18n;
  app.use(i18n.init);
  app.use("/doc", express.static(path.join(__dirname, app.config.get(
    "server:docsPath"))));
  app.use("/static", express.static(path.join(__dirname, app.config.get(
    "server:staticPath"))));
  app.use(express.static(__dirname + '/client'));


  app.responder = responder(app);



  process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err.stack);
    process.exit();
  });


  app.emailSender = app.config.get("emailSender");
  app.confirmUserUrl = app.config.get("confirmUserUrl");
  app.resetPasswordUrl = app.config.get("resetPassword");
  app.localCognitoConfig = app.config.get("localCognitoConfig");
  app.allowedLoginAttempts = app.config.get("allowedLoginAttempts");
  app.loginAttemptsBlockingTime = app.config.get("loginAttemptsBlockingTime");

  // Routes
  models(app);
  controllers(app);
  routes(app);
  //cronjobs
  //require("./src/utils/cronjobs")(app);
  this.app = app;
  return this;
};

Server.prototype.setupLogging = function(app) {
  return app.log = require("./src/utils/logger")(app.config.get("logging"));
};

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

Server.prototype.start = function() {
  var _this = this;
  console.log("Running env=%s", this.app.get("env"));
  require('http').createServer(this.app).listen(this.app.config.get(
    "server:ports:public"), function() {
    console.log("http server (public) worker started, sharing port " +
      _this.app.config.get("server:ports:public"));
  });
};

module.exports = Server;
