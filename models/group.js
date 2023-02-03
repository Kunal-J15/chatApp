const sequelize  = require("../utils/database");
const Sequelize = require("sequelize");
// const User = require("./user");

const Group = sequelize.define("group",{
    id:{
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    description:{
        type:Sequelize.STRING
    },
    adminId:{
        type:Sequelize.INTEGER,
        references:{
            model:"Users",
            key:"id"
        }
    },
})

module.exports = Group;