module.exports = function(app, options) {

  var Sequelize = require('sequelize');
  var Inventory = app.db.define('inventory', {
    username: {
      type: Sequelize.STRING,
      field: 'username'
    },
    productName: {
      type: Sequelize.STRING,
      field: 'productName'
    },
    productType: {
      type: Sequelize.STRING,
      field: 'productType'
    },
    quantity: {
      type: Sequelize.INTEGER,
      field: 'quantity'
    }
  });
  Inventory.sync();
  return {
    name: 'Inventory',
    db: Inventory
  };
};
