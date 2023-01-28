require('dotenv').config()
const express  = require("express");
const cors = require("cors")
const app = express();
const sequelize = require("./utils/database")
const User = require("./models/user");
const Message = require("./models/message");
const userRoute = require("./routes/user");
const messageRoute = require("./routes/message")
app.use(cors({
    origin:"*",
}))
app.use(express.urlencoded({extended:true}));
app.use(express.json())
app.get("/",(req,res)=>{
    res.send()
})


app.use("/user",userRoute);
app.use('/message',messageRoute);
User.hasMany(Message);
Message.belongsTo(User);

sequelize.sync(//{force:true}
).then(()=>{
    app.listen(3000,()=>{console.log("listning on 3000");})
}).catch((e)=>{
    console.log("error",e);
})
