const sequalize = require("../utils/database");
const Sequelize =require("sequelize")
const Message = sequalize.define("message",{
    id:{
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    msg:{
        type:Sequelize.STRING,
        allowNull:false
    }
})

module.exports= Message;