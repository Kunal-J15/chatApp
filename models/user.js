const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require("../utils/database")

const User = sequelize.define("user", {
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
  name: {
    type:DataTypes.STRING,
    allowNull:false,
},
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull:false
  },
  number:{
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type:DataTypes.STRING,
    allowNull:false
    }
});

module.exports = User;