module.exports = function(app) {
  var AuctionController = app.controllers.Auction;
  var UserController = app.controllers.User;

  app.get(app.config.get('server:routePrefix') + '/createauction/',
    UserController.isLoggedIn, AuctionController.createAuction);

  app.get(app.config.get('server:routePrefix') + '/getauction/',
    AuctionController.getCurrentAuction);


};
