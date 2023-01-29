const express =require("express");
const { route } = require("./user");
const router = express.Router({mergeParams:true});
const {isAutherize} = require("../utils/utils.js");
const Message = require("../models/message");
const User = require("../models/user");
const { Op } = require("sequelize");
router.route("/")
    .get(isAutherize,async(req,res,next)=>{
        const {lastId,lastMy} = req.query;
        const messages = await Message.findAll({
            where:{
                id:{
                    [Op.gt]:parseInt(lastId)
                }
            },
            limit:13,
            include:[{
                model:User,
                attributes:["name"]
            }
            ]
            ,
            attributes:["createdAt","msg","id"],
            order:[["createdAt","DESC"]]
        });
        var myMsg=[]
    if(messages.length){
        myMsg = await req.user.getMessages({where:{
            id:{
                [Op.gt]:lastId
            }
        },
        limit:13,
            attributes:["createdAt","msg","id"],
            order:[["createdAt","DESC"]]
        });
    }
        res.status(200).json({msg:"success",data:[messages,myMsg]})
    })
    .post(isAutherize,async(req,res,next)=>{
        const {text}=  req.body;
        await req.user.createMessage({msg:text});
        res.status(200).json({msg:"saved"})
})

module.exports = router