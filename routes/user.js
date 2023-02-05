const express = require("express");
const router = express.Router({ mergeParams: true });

const { isAutherize, isGroupAdmin, isAuthenticGroup,isFriendsOfAdmin,isMembersOfGroup } = require("../utils/utils.js");
const {signup,login,getFriends,getGroups,getGroupMembers,postFriends,addGroup,deleteGroup,editGroupMembers,addAdmin} = require("../controllers/user")

// router.get("/", (req, res) => {
//     res.send("user")
// })
router.post("/", signup)
router.post("/login", login)

router.route("/friend")
    .get(isAutherize, getFriends)
    .post(isAutherize, postFriends)

router.route("/group")
        .get(isAutherize, getGroups)
        .post(isAutherize, addGroup)
        .delete(isAutherize,isAuthenticGroup,isGroupAdmin,deleteGroup)

router.route("/group/member")
    .get(isAutherize,isAuthenticGroup,isGroupAdmin,getGroupMembers)
    .post(isAutherize,isAuthenticGroup,isGroupAdmin,isFriendsOfAdmin,editGroupMembers)
    router.post("/group/addAdmin",isAutherize,isAuthenticGroup,isGroupAdmin,isMembersOfGroup,addAdmin)



module.exports = router;