const express =require("express");
const { route } = require("./user");
const router = express.Router({mergeParams:true});
const {isAutherize} = require("../utils/utils.js");
const Message = require("../models/message");
const User = require("../models/user");

router.route("/")
    .get(isAutherize,async(req,res,next)=>{
        const messages = await Message.findAll({
            include:[{
                model:User,
                attributes:["name"]
            }
            ]
            ,
            attributes:["createdAt","msg","id"]
        });
        res.status(200).json({msg:"success",data:messages})
    })
    .post(isAutherize,async(req,res,next)=>{
        const {text}=  req.body;
        await req.user.createMessage({msg:text});
        res.status(200).json({msg:"saved"})
})

module.exports = router