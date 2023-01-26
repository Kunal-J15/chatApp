require('dotenv').config()
const express  = require("express");
const app = express();
const sequelize = require("./utils/database")
const User = require("./models/user");
const userRoute = require("./routes/user");

app.use(express.urlencoded({extended:true}));
app.get("/",(req,res)=>{
    res.send()
})


app.use("/user",userRoute);
sequelize.sync({force:true}).then(()=>{
    app.listen(3000,()=>{console.log("listning on 3000");})
}).catch((e)=>{
    console.log("error",e);
})
