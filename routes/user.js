const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const { isAutherize, isGroupAdmin, isAuthenticGroup,isFriendsOfAdmin,isMembersOfGroup } = require("../utils/utils.js");
const {signup,login,getFriends,getGroups,getGroupMembers,postFriends,addGroup,deleteGroup,editGroupMembers,addAdmin} = require("../controllers/user")

router.post("/", catchAsync(signup))
router.post("/login", login)

router.route("/friend")
    .get(catchAsync(isAutherize), catchAsync(getFriends))
    .post(catchAsync(isAutherize), catchAsync(postFriends))

router.route("/group")
        .get(catchAsync(isAutherize), catchAsync(getGroups))
        .post(catchAsync(isAutherize), catchAsync(addGroup))
        .delete(catchAsync(isAutherize),catchAsync(isAuthenticGroup),catchAsync(isGroupAdmin),catchAsync(deleteGroup))

router.route("/group/member")
    .get(catchAsync(isAutherize),isAuthenticGroup,isGroupAdmin,getGroupMembers)
    .post(isAutherize,isAuthenticGroup,isGroupAdmin,isFriendsOfAdmin,editGroupMembers)
    router.post("/group/addAdmin",isAutherize,isAuthenticGroup,isGroupAdmin,isMembersOfGroup,addAdmin)



module.exports = router;