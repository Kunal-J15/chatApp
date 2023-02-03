const express = require("express");
const router = express.Router({ mergeParams: true });
const { isAutherize, isAuthenticFriend,friendNotificationUpdate , groupNotificationUpdate , isAuthenticGroup } = require("../utils/utils.js");
const Message = require("../models/message");
const User = require("../models/user");
const { Op } = require("sequelize");
const UserGroup = require("../models/userGroup.js");
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
                attributes: ["createdAt", "msg", "id"],
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
                    attributes: ["createdAt", "msg", "id"],
                    order: [["createdAt", "DESC"]]
                });
            }
            res.status(200).json({ msg: "success", data: [messages, myMsg] })
        }

    })
    .post(isAutherize, isAuthenticFriend,friendNotificationUpdate ,async (req, res, next) => {
        const { text, chatType } = req.body;
        if (chatType === "ooo") {
            await req.user.createMessage({ msg: text, receiverId: req.friend.id });
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
                attributes: ["createdAt", "msg", "id"],
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
                    attributes: ["createdAt", "msg", "id"],
                    order: [["createdAt", "DESC"]]
                })
            }
            const admins = req.group.admin.map(e=>e.id);
            res.status(200).json({ msg: "success", data: [messages, myMsg], isAdmin: admins.includes(req.user.id) });
            
        
        })
        .post(isAutherize, isAuthenticGroup,groupNotificationUpdate , async(req,res,next)=>{
            const { text, chatType } = req.body;
            await req.user.createMessage({ msg: text, groupId: req.group.id });
            res.status(200).json({ msg: "saved" })
        })

module.exports = router