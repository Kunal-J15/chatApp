const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require("../utils/database")

const User = sequelize.define("user", {
    id:{
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
        allowNull:false,
        primaryKey:true
    },
  name: {
    type:DataTypes.STRING,
    allowNull:false,
    validate:{
      len: [1,12]
    }
},
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull:false
  },
  number:{
    type: Sequelize.STRING,
    allowNull: false,
    unique:true
  },
  password: {
    type:DataTypes.STRING,
    allowNull:false
    },
});

module.exports = User;