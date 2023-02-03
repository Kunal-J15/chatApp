const sequelize  = require("../utils/database");
const Sequelize = require("sequelize");

const Friendship = sequelize.define("friendship", {
    notification: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    }
  });
  module.exports = Friendship;