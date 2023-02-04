const express = require("express");
const bcrypt = require('bcrypt');
const router = express.Router({ mergeParams: true });
const User = require("../models/user")
const { generateAccessToken } = require("../utils/utils")
const { isAutherize, isGroupAdmin, isAuthenticGroup,isFriendsOfAdmin,isMembersOfGroup } = require("../utils/utils.js");
const salt = 10;
const { Op } = require("sequelize");

router.get("/", (req, res) => {
    res.send("user")
})
router.post("/", async (req, res, next) => {
    try {
        // console.log(req.body);
        const { name, email, password, number } = req.body;
        const hash = bcrypt.hashSync(password, salt);
        const user = User.build({ name, email, password: hash, number });
        await user.save();
        res.json({ msg: "succeffuly saved" });
    } catch (error) {
        console.log(error);
        res.status(401).json({ msg: "user already exist try with different email" })
    }
})
router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (user) {
            bcrypt.compare(password, user.password, function (err, result) {
                if (err) return res.status(301).send("something went Wrong");
                if (result) res.status(200).json({ msg: "login succeful", id: generateAccessToken(user.id) });
                else return res.send(401).json({ msg: "invalid email or password" });
            });
        }
        else return res.status(403).json({ msg: "User does not exist" })
    } catch (error) {
        console.log(error);
    }
})

router.route("/friend")
    .get(isAutherize, async (req, res, next) => {
        const friends = await req.user.getFriends({
            attributes:["name","id"],
        });
        const filteredFriends = friends.map(friend => {
            const { friendship, ...filteredFriend } = friend.toJSON();
             filteredFriend.notification = friendship.notification;
             return filteredFriend;
          });
        //console.log(JSON.stringify(friends));    // ..................HOW TO EXCLUDE "friendship" field while querring? 
        res.status(200).json({friends:filteredFriends})
    })
    .post(isAutherize, async (req, res, next) => {
        const { number } = req.body;
        if(number == req.user.number) return res.status(403).json({msg:"can't add self as a friend"})
        const friend = await User.findOne({ where: { number } });
        if (friend) {
            await req.user.addFriend(friend.id);
            return res.status(200).json({ msg: "success" })
        }
        return res.status(403).json({ msg: "user not found with number" });
    })

router.route("/group")
        .get(isAutherize, async (req, res, next) => {
            const groups = await req.user.getGroups({
                attributes:["name","id"]
            });
            const filteredGroups = groups.map(friend => {
                const { userGroup, ...filteredGroup } = friend.toJSON();
                filteredGroup.notification= userGroup.notification;
                // filteredGroup.adminId = filteredGroup.adminId===req.user.id;
                return filteredGroup;
            });
           // console.log(JSON.stringify(groups),filteredGroups);    // ..................HOW TO EXCLUDE "UserGroup" field while querring? 
            res.status(200).json({groups:filteredGroups})
        })
        .post(isAutherize, async (req, res, next) => {
            const { name,description } = req.body;
            let grp = await req.user.createGroup({name,description});
            grp =  await grp.addAdmin(req.user.id);
            return res.status(200).json({ msg: "group created with name "+ name });
        })
        .delete(isAutherize,isAuthenticGroup,isGroupAdmin,async (req, res, next) => {
            await req.group.destroy();
            res.status(200).json({msg:"Group deleted succefully"})
        })

router.route("/group/member")
    .get(isAutherize,isAuthenticGroup,isGroupAdmin,async(req,res,next)=>{
        const mems = await req.group.getUsers({
            attributes:["name","id"],
            include:[]
        })
        const filteredMems = mems.map(friend => {
            const { userGroup,admin, ...filteredMem } = friend.toJSON();
            filteredMem.isAdmin = req.admins.includes(filteredMem.id)
            return filteredMem;
        });

        res.status(200).json({members:filteredMems});
    })
    .post(isAutherize,isAuthenticGroup,isGroupAdmin,isFriendsOfAdmin,async(req,res,next)=>{
        let {removeList,addList} = req.body;
        const l = [];
        // console.log(removeList,typeof(removeList),typeof([]));
        for (const u of removeList) {
            l.push(req.group.removeUser(u))
        }

        for (const u of addList) {
            l.push(req.group.addUser(u));
        }
        await Promise.all(l);
        res.status(200).json({msg:"group edited succesfully"})
       
    })
    router.post("/group/addAdmin",isAutherize,isAuthenticGroup,isGroupAdmin,isMembersOfGroup,async(req,res,next)=>{
        let {adminList} = req.body;
        const l = [];
        // console.log(removeList,typeof(removeList),typeof([]));

        for (const u of adminList) {
            l.push(req.group.addAdmin(u));
        }
        await Promise.all(l);
        res.status(200).json({msg:"Admin's added group edited succesfully"})
       
    })



module.exports = router;