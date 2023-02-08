const sequalize = require("../utils/database");
const Sequelize =require("sequelize")
const Message = sequalize.define("archiveMessage",{
    id:{
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    msg:{
        type:Sequelize.STRING,
        allowNull:false
    },
    isLink:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
      }
})


module.exports= Message;