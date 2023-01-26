const express  = require("express");
const bcrypt = require('bcrypt');
const router = express.Router({mergeParams:true});
const User = require("../models/user")
const salt =10;

router.get("/",(req,res)=>{
    res.send("user")
})
router.post("/",async(req,res,next)=>{
    try {
        console.log(req.body);
    const {name,email,password,number} = req.body;
    const hash = bcrypt.hashSync(password, salt);
    const user = User.build({name,email,password:hash,number});
    await user.save();
    res.send("succeffuly saved")
    } catch (error) {
        console.log(error);
        res.status(404).send("user already exist try with different email")
    }})

module.exports = router;