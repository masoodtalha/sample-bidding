module.exports = function(app) {
  var _ = require('underscore');
  var fs = require('fs');
  var async = require('async');
  var crypto = require('crypto');
  var bcrypt = require('bcrypt-nodejs');
  //  var bcrypt = require('bcrypt');
  var path = require('path');
  var uuid = require('node-uuid');
  var rest = require('restler');
  var moment = require('moment');
  // var mkdirp	=	require('mkdirp');
  var Auction = app.models.Auction;
  var Token = app.models.Token;
  var Inventory = app.models.Inventory;

  var Controller = {
    name: Auction.name
  };

  _updateUserInventory = function(username, inventoryName, itemQty) {

    var inventortToUpdate = Inventory.db.findAll({
      where: {
        'username': username,
        'productName': inventoryName
      },
      attributes: ['quantity']
    }).then(function(inventoryFound) {

      Inventory.db.update({
        quantity: inventoryFound[0].dataValues.quantity - itemQty,
      }, {
        where: {
          'username': username,
          'productName': inventoryName
        }
      });

    });

  };

  _isAuctionInProgress = function(){
    var auctions = Auction.db.findAll({

    })

    return auctions;
    
  };

  Controller.getCurrentAuction = function(req, res, next){
     var username = req.query.username;

    var auctions = Auction.db.findAll({
  
    }).then(function(auctions){

      for(var i = 0; i < auctions.length; i++ ){
        if(auctions[i].dataValues.username === username){
          continue;
        }

        var startTime = moment(auctions[i].dataValues.createdAt);
        var endTime = moment(Date.now());

        var diff = endTime.diff(startTime, 'seconds');

        if(diff <= 90){
          return app.responder.send(200, res,
          'Auction In Process', auctions[i], null);
        }

      }

      return app.responder.send(200, res,
          'No Auction', {'hasAuction': false}, null);
    });
  };


  Controller.createAuction = function(req, res, next) {
    var username = req.query.username;
    var itemType = req.query.itemType;

    var itemName = req.query.itemName;

    var itemQty = req.query.itemQty;

    var minBid = req.query.minBid;

    _isAuctionInProgress().then(function(auctions){


      for(var i = 0 ; i < auctions.length; i++){

        var startTime = moment(auctions[i].dataValues.createdAt);
        var endTime = moment(Date.now());

        var diff = endTime.diff(startTime, 'seconds');

        if(diff <= 90){
          return app.responder.send(200, res,
          'Auction In Process', {'auctionProgress': true}, null);
        }
      }

      var auction = Auction.db.build({
        username: username,
        itemType: itemType,
        itemName: itemName,
        itemQty: itemQty,
        minBid: minBid
      })
      .save()
      .then(function(data) {
        _updateUserInventory(username, itemName, itemQty);
        return app.responder.send(200, res,
          'Auction Successfully Created', {}, null);
      });

    });

  };

  return Controller;
};
