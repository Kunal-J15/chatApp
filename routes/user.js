const express  = require("express");
const bcrypt = require('bcrypt');
const router = express.Router({mergeParams:true});
const User = require("../models/user")
const {generateAccessToken} = require("../utils/utils")
const salt =10;

router.get("/",(req,res)=>{
    res.send("user")
})
router.post("/",async(req,res,next)=>{
    try {
        // console.log(req.body);
    const {name,email,password,number} = req.body;
    const hash = bcrypt.hashSync(password, salt);
    const user = User.build({name,email,password:hash,number});
    await user.save();
    res.json({msg:"succeffuly saved"});
    } catch (error) {
        console.log(error);
        res.status(401).json({msg:"user already exist try with different email"})
    }})
router.post("/login",async(req,res,next)=>{
    try {
        const {email,password} = req.body;
        const user = await User.findOne({where:{email}});
        if(user){
            bcrypt.compare(password,user.password, function(err, result) {
                if(err) res.status(301).send("something went Wrong");
                if(result)res.status(200).json({msg:"login succeful",id:generateAccessToken(user.id)});
                else res.send(401).json({msg:"invalid email or password"});
            });
        }
        else res.status(403).json({msg:"User does not exist"})
    } catch (error) {
        console.log(error);
    }
})
module.exports = router;