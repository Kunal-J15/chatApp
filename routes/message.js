const express = require("express");
const router = express.Router({ mergeParams: true });
const { isAutherize, isAuthenticFriend,friendNotificationUpdate , groupNotificationUpdate , isAuthenticGroup } = require("../utils/utils.js");
const {getFriendMessages,postFriendMessages,getGroupMessages,postGroupMessages} = require("../controllers/message");
const multer = require('multer');
const upload = multer();
const catchAsync = require("../utils/catchAsync");

router.route("/")
    .get(catchAsync(isAutherize), catchAsync(isAuthenticFriend), catchAsync(friendNotificationUpdate) , catchAsync(getFriendMessages))
    .post(catchAsync(isAutherize),upload.single("files"), catchAsync(isAuthenticFriend),catchAsync(friendNotificationUpdate),catchAsync(postFriendMessages))



router.route("/group")
        .get(catchAsync(isAutherize), catchAsync(isAuthenticGroup),catchAsync(groupNotificationUpdate) ,catchAsync(getGroupMessages))
        .post(catchAsync(isAutherize),upload.single("files"), catchAsync(isAuthenticGroup),catchAsync(groupNotificationUpdate),catchAsync(postGroupMessages))

module.exports = router