const sequelize  = require("../utils/database");
const Sequelize = require("sequelize");

const UserGroup = sequelize.define("userGroup", {
    notification: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  });
module.exports = UserGroup;