const jwt = require('jsonwebtoken');
const User = require('../models/user');
module.exports.generateAccessToken = function (username) {
  return jwt.sign(username, process.env.JWT_SECRET);
}

module.exports.isAutherize = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, id) => {
      if (err) {
        console.log(err);
        return res.status(403).json({ msg: "bad request" });
      }
      let user = await User.findOne({ where: { id } });
      if (user) {
        req.user = user;
        return next();
      } else return res.status(403).json({ msg: "user not found" })
    })
  } else return res.status(401).json({ msg: "login first" });
}

module.exports.isAuthenticFriend = async (req, res, next) => {
  var { chatType, convId } = req.query;
  if (req.method == "POST") {
    chatType = req.body.chatType;
    convId = req.body.convId
  }
  if (chatType === "ooo") {
    const friend = await req.user.getFriends({
      where: {
        id: convId
      },
      limit: 1
    });

    if (friend[0]) {
      req.friend = friend[0];
      return next();
    } else {
      return res.status(403).json({ msg: "not a friend" })
    }
  }
  return res.status(403).json({ msg: "invalid chatType" })
}

module.exports.isAuthenticGroup = async (req, res, next) => {
  var { chatType, convId } = req.query;
  if (req.method == "POST") {
    chatType = req.body.chatType;
    convId = req.body.convId
  }
  if (chatType === "group") {
    const group = await req.user.getGroups({
      where: {
        id: convId
      },
      limit: 1,
      attributes: ["name", "id", "description", "adminId",]
    });
    if (group[0]) {
      req.group = group[0];
      return next();
    } else return res.status(403).json({ msg: "not a member of group" })

  }
  return res.status(403).json({ msg: "invalid chatType" + chatType })
}

module.exports.isGroupAdmin = async (req, res, next) => {
  if (req.group.adminId === req.user.id) return next();
  return res.status(401).json({ msg: "Not a Group Admin" });
}
module.exports.friendNotificationUpdate  = async (req, res, next) => { // to reduce sql calls but handled by frontEnd
  if (req.method == "POST") {
    const fFriend = await req.friend.getFriends({
      where: {
        id: req.user.id
      },
      limit: 1
    })
    if(fFriend[0]){
      fFriend[0].friendship.notification = true; //.........IS THERE BETTER WAY...........
      await fFriend[0].friendship.save();
    }
  } else if (req.method == "GET") {
    req.friend.friendship.notification = false;
    await req.friend.friendship.save();
  }
  return next()
}

module.exports.groupNotificationUpdate = async (req, res, next) => { // to reduce sql calls but handled by frontEnd
  if (req.method == "POST") {
    const mems = await req.group.getUsers()
    const p = [];
    for (const mem of mems) {
      mem.userGroup.notification = true;
      p.push(mem.userGroup.save())
    }
    await Promise.all(p);
  } else if (req.method == "GET") {
    const mem = await req.group.getUsers({
      where: {
        id: req.user.id
      }
    })
    if (mem[0]) {
      mem[0].userGroup.notification = false;
      await mem[0].userGroup.save();
    } else return res.status(403).json({ msg: "something went wrong/ not a member of group" });
  }
  return next()
}