const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'shopping_cart.db',
  logging: false,
});

module.exports = { sequelize };
