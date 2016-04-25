var fs = require('fs');
var path = require('path');
module.exports = function(app) {
  app.models = app.models || {};
  fs.readdirSync(__dirname).forEach(function(f) {
    if (f !== "index.js" && path.extname(f) === '.js') {
      var model = require(path.join(__dirname, f))(app);
      if (model && model.name && model.name.length && !(model.name in app
          .models)) {
        app.models[model.name] = model;
      }
    }
  });
};
