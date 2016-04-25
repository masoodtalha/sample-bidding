module.exports = function(app, options) {

  var Sequelize = require('sequelize');
  var moment = require('moment');

  var Auction = app.db.define('auction', {
    username: {
      type: Sequelize.STRING,
      field: 'username'
    },
    startedAt: {
      type: Sequelize.STRING,
      field: 'startedAt',
      defaultValue: moment().format("YYYY-MM-DD HH:mm:ss")
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      field: 'isActive',
      defaultValue: true
    },
    itemType: {
      type: Sequelize.STRING,
      field: 'itemType'
    },
    itemName: {
      type: Sequelize.STRING,
      field: 'itemName'
    },
    minBid: {
      type: Sequelize.INTEGER,
      field: 'minBid'
    },
    itemQty: {
      type: Sequelize.INTEGER,
      field: 'itemQty'
    }
  });
  Auction.sync();
  return {
    name: 'Auction',
    db: Auction
  };
};
