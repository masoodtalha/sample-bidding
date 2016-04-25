module.exports = function(app) {
  var UserController = app.controllers.User;

  app.get(app.config.get('server:routePrefix') + '/user',
    UserController.get);

  app.post(app.config.get('server:routePrefix') + '/user',
    UserController.loginOrRegisterUser);

  app.get(app.config.get('server:routePrefix') + '/user/:username/inventory',
    UserController.isLoggedIn, UserController.getAllInventoryUser);

};
