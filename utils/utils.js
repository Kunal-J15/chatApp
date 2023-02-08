const jwt = require('jsonwebtoken');
const User = require('../models/user');
// const multer = require('multer');
const AWS = require('aws-sdk');
// const multerS3 = require('multer-s3');
module.exports.generateAccessToken = function (username) {
  return jwt.sign(username, process.env.JWT_SECRET);
}

module.exports.isAutherize = async (req, res, next) => {

  try {
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
  } catch (error) {
      console.log(error);
      res.status(300).json({ msg: "error"});
  }

  
}

module.exports.isAuthenticFriend = async (req, res, next) => {

  try {
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
  } catch (error) {
      console.log(error);
      res.status(300).json({ msg: "error"});
  }

  
}

module.exports.isAuthenticGroup = async (req, res, next) => {

  try {
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
        include: [
          {
              model: User,
              as: "admin",
              attributes: ["id"]
          },
      ],
        limit: 1,
        attributes: ["name", "id", "description",]
      });
      if (group[0]) {
        req.group = group[0];
        req.admins = req.group.admin.map(e=>e.id);
        return next();
      } else return res.status(403).json({ msg: "not a member of group" })
  
    }
    return res.status(403).json({ msg: "invalid chatType" + chatType })
  } catch (error) {
      console.log(error);
      res.status(300).json({ msg: "error"});
  }

  
}

module.exports.isGroupAdmin = async (req, res, next) => {

  try {
    if (req.admins.includes(req.user.id)) return next();
    return res.status(401).json({ msg: "Not a Group Admin" });
  } catch (error) {
      console.log(error);
      res.status(300).json({ msg: "error"});
  }

 
}
module.exports.friendNotificationUpdate  = async (req, res, next) => { // to reduce sql calls but handled by frontEnd

  try {
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
  } catch (error) {
      console.log(error);
      res.status(300).json({ msg: "error"});
  }

 
}

module.exports.groupNotificationUpdate = async (req, res, next) => { // to reduce sql calls but handled by frontEnd

  try {
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
  } catch (error) {
      console.log(error);
      res.status(300).json({ msg: "error"});
  }

  
}


module.exports.isFriendsOfAdmin =async (req, res, next) => {


  try {
    const {addList} = req.body;
    if(addList){
      let friends = await req.user.getFriends({
        attributes:["id"]
      });
      friends = friends.map(e=>e.id);
    
      if(addList){
        for (const mem of addList) {
          if(!friends.includes(mem)) return res.status(403).json({msg:"Not a friend of admin"})
        }
      }
    }
  
    next();
  } catch (error) {
      console.log(error);
      res.status(300).json({ msg: "error"});
  }

 
}

module.exports.isMembersOfGroup = async (req, res, next) => {

  try {
    let mems = await req.group.getUsers({
      attributes:["id"]
    });
    mems = mems.map(e=>e.id);
    const {adminList,removeList} = req.body;
    if(adminList){
      for (const mem of adminList) {
        if(!mems.includes(mem)) return res.status(403).json({msg:"Not a member of group"})
      }
    }
    
    if(removeList){
      for (const mem of removeList) {
        if(!mems.includes(mem)) return res.status(403).json({msg:"Not a member of group in remove list"})
      }
    }
    next();
  } catch (error) {
      console.log(error);
      res.status(300).json({ msg: "error"});
  }

  
}

exports.uploadToAWS = async(data,name)=>{
  const s3Bucket = new AWS.S3({
    accessKeyId:process.env.AWS_access,
    secretAccessKey:process.env.AWS_secret,
    Bucket:"expensetraker"
  })
   var params={
       Bucket:"expensetraker",
       Key:name,
       Body:data,
       ACL:"public-read"
   }

   return new Promise ((resolve,reject)=>{
       s3Bucket.upload(params,(err,AWSres)=>{
       if(err) reject( err);
       else { //console.log(AWSres);
           resolve(AWSres.Location);
       }
   })})
}