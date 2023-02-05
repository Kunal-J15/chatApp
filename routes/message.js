const express = require("express");
const router = express.Router({ mergeParams: true });
const { isAutherize, isAuthenticFriend,friendNotificationUpdate , groupNotificationUpdate , isAuthenticGroup } = require("../utils/utils.js");
const {getFriendMessages,postFriendMessages,getGroupMessages,postGroupMessages} = require("../controllers/message");
const multer = require('multer');
const upload = multer();

router.route("/")
    .get(isAutherize, isAuthenticFriend, friendNotificationUpdate , getFriendMessages)
    .post(isAutherize,upload.single("files"), isAuthenticFriend,friendNotificationUpdate,postFriendMessages)



router.route("/group")
        .get(isAutherize, isAuthenticGroup,groupNotificationUpdate ,getGroupMessages)
        .post(isAutherize,upload.single("files"), isAuthenticGroup,groupNotificationUpdate,postGroupMessages)

module.exports = router