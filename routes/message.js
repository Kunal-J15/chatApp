const express = require("express");
const router = express.Router({ mergeParams: true });
const { isAutherize, isAuthenticFriend,friendNotificationUpdate , groupNotificationUpdate , isAuthenticGroup,uploadToAWS } = require("../utils/utils.js");
const Message = require("../models/message");
const User = require("../models/user");
const { Op } = require("sequelize");
const UserGroup = require("../models/userGroup.js");
const multer = require('multer');
const upload = multer();

// ,(req, res, next) => {
//     try {
      
//       console.log(req.body);
    
//       console.log(req.files);
//       // res.send("done")
//       // next();
//     } catch (error) {
//       console.log(error);
//       res.status(300).json({msg:"too many files"})
//     } 
   
//   },

router.route("/")
    .get(isAutherize, isAuthenticFriend, friendNotificationUpdate , async (req, res, next) => {
        const { lastId = 0, chatType, convId } = req.query;
        if (chatType == "ooo") {
            const messages = await Message.findAll({
                where: {
                            id: { [Op.gt]: lastId },
                            [Op.or]: [
                                { [Op.and]: [{ receiverId: req.friend.id }, { userId: req.user.id } ]},
                                { [Op.and]: [{ receiverId: req.user.id }, { userId: req.friend.id }]}
                            ]
                },
                limit: 13,
                include: [
                    {
                        model: User,
                        as: "receiver",
                        attributes: ["name"]
                    },
                    {
                        model: User,
                        as: "sender",
                        attributes: ["name"]
                    },
                ],
                attributes: ["createdAt", "msg", "id","isLink"],
                order: [["createdAt", "DESC"]]
            });
            var myMsg = []
            if (messages.length) {
                myMsg = await req.user.getMessages({
                    where: {
                        id: {
                            [Op.gt]: lastId
                        },
                        receiverId: req.friend.id
                    },
                    limit: 13,
                    attributes: ["createdAt", "msg", "id","isLink"],
                    order: [["createdAt", "DESC"]]
                });
            }
            res.status(200).json({ msg: "success", data: [messages, myMsg] })
        }

    })
    .post(isAutherize,upload.single("files"), isAuthenticFriend,friendNotificationUpdate,async (req, res, next) => {
        const { text, chatType } = req.body;
        if (chatType === "ooo") {
            
            if(req.file){
                const name = `Chat/${Date.now()}___${req.file.originalname}`;
                console.log(name);
                if(text.trim()!=""){
                    const location = await Promise.all([req.user.createMessage({ msg: text, receiverId: req.friend.id }),uploadToAWS(req.file.buffer,name)]);
                    await req.user.createMessage({ msg: location[1], receiverId: req.friend.id ,isLink:true});
                }else{
                    const location = await uploadToAWS(req.file.buffer,name);
                    await req.user.createMessage({ msg: location, receiverId: req.friend.id ,isLink:true});
                }
                
                
            }else if(text.trim()!="") await req.user.createMessage({ msg: text, receiverId: req.friend.id });

            res.status(200).json({ msg: "saved" })
        }
    })



    router.route("/group")
        .get(isAutherize, isAuthenticGroup,groupNotificationUpdate ,async (req, res, next) => {
            const { lastId = 0, chatType, convId } = req.query;

            const messages = await Message.findAll({
                where:{
                    id: { [Op.gt]: lastId },
                    groupId:req.group.id
                },
                include: [
                    {
                        model: User,
                        as: "sender",
                        attributes: ["name"]
                    },
                ],
                limit:13,
                attributes: ["createdAt", "msg", "id","isLink"],
                order: [["createdAt", "DESC"]]
            })
        
            var myMsg=[];
            if(messages.length){
                myMsg = await req.user.getMessages({
                    where:{
                        groupId:req.group.id,
                        id: { [Op.gt]: lastId },
                    },
                    limit:13,
                    attributes: ["createdAt", "msg", "id","isLink"],
                    order: [["createdAt", "DESC"]]
                })
            }
            const admins = req.group.admin.map(e=>e.id);
            res.status(200).json({ msg: "success", data: [messages, myMsg], isAdmin: admins.includes(req.user.id) });
            
        
        })
        .post(isAutherize,upload.single("files"), isAuthenticGroup,groupNotificationUpdate,async(req,res,next)=>{
            const { text, chatType } = req.body;

            if(req.file){
                const name = `Chats/${Date.now()}___${req.file.originalname}`;
                if(text.trim()!=""){
                    const location = await Promise.all([req.user.createMessage({ msg: text, groupId: req.group.id }),uploadToAWS(req.file.buffer,name)]);
                    await req.user.createMessage({ msg: location[1], groupId: req.group.id,isLink:true });
                }else{
                    const location = await uploadToAWS(req.file.buffer,name);
                    await req.user.createMessage({ msg: location, groupId: req.group.id ,isLink:true});
                }
            }else if(text.trim()!="") await req.user.createMessage({ msg: text, groupId: req.group.id });
            res.status(200).json({ msg: "saved" })
        })

module.exports = router