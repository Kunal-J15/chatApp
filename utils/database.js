const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('chat-app', 'root', process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
  })

  module.exports = sequelize;