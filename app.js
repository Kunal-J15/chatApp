require('dotenv').config()
const express  = require("express");
const cors = require("cors")
const app = express();
const sequelize = require("./utils/database")
const User = require("./models/user");
const Message = require("./models/message");
const userRoute = require("./routes/user");
const messageRoute = require("./routes/message");
// const Conversation = require('./models/conversation');
const Group = require('./models/group');
const bcrypt = require('bcrypt');
const path = require("path")
const Friendship = require('./models/friendship');
const UserGroup = require('./models/userGroup');
const ArchiveMessage = require("./models/archiveMessages");
const job = require("./utils/cronJob");
const jwt = require('jsonwebtoken');
const { disconnect } = require('process');
app.use(cors({
    origin:"*",
}))
app.use(express.urlencoded({extended:true}));
app.use(express.json())

app.use(express.static(__dirname + '/public'));




app.use("/user",userRoute);
app.use('/message',messageRoute);

app.get("*",(req,res,next)=>{
  // console.log("in");
  res
})

User.hasMany(Message);
 
Message.belongsTo(User, {
    as: "receiver",
    foreignKey: "receiverId"
  });

Message.belongsTo(User, {
    as: "sender", 
    foreignKey: "userId"
  }); 
Group.belongsToMany(User, { through:'adminGroup',as:"admin" ,foreignKey: 'adminId' });

Group.belongsToMany(User,{ through: 'userGroup' });
User.belongsToMany(Group, { through: 'userGroup',onDelete:"CASCADE" });

Group.hasMany(Message,{onDelete:"CASCADE"});
Message.belongsTo(Group);

User.belongsToMany(User, {
    as: 'friends',
    through: "friendship",
    foreignKey: 'userId',
    otherKey: 'friendId'
  });



  User.hasMany(ArchiveMessage);
 
  ArchiveMessage.belongsTo(User, {
      as: "receiver",
      foreignKey: "receiverId"
    });
  
  ArchiveMessage.belongsTo(User, {
      as: "sender", 
      foreignKey: "userId"
    }); 
  Group.hasMany(ArchiveMessage,{onDelete:"CASCADE"});
    ArchiveMessage.belongsTo(Group);

    
var option// = {force: true}
sequelize.sync(option
).then(async()=>{
    if(option){
        const hash = bcrypt.hashSync("a", 10);
        const user1 = User.build({ name:"a", email:"a@gmail.com", password: hash, number:9866393399 });
        const user2 = User.build({ name:"ab", email:"ab@gmail.com", password: hash, number:9999999999 });
        const user3 = User.build({ name:"c", email:"c@gmail.com", password: hash, number:123456789 });
        const user4 = User.build({ name:"d", email:"d@gmail.com",password: hash,number:01234567});
        await user1.save();await user2.save();await user3.save();await user4.save();
        const ans2 = await Promise.all([user1.addFriend(user2.id),user1.addFriend(user3.id),user1.addFriend(user4.id),user2.addFriend(user1.id),user3.addFriend(user4.id),user4.addFriend(user3.id),user4.addFriend(user1.id),user3.addFriend(user1.id)]);
    }
    // job.start();
    const server = app.listen(process.env.PORT,()=>{console.log("listning on 3000");});
    const socket = require('./utils/socket');
    const io = socket.init(server);

    io.on('connection',(s)=>{
      const token = s.handshake.query.token;
      if (!token) {
        s.emit('connection_error', { message: 'Connection rejected' });
        s.disconnect();
        return;
      }else{
        jwt.verify(s.handshake.query.token,process.env.JWT_SECRET,(err,id)=>{
          if(!err && id){
            if(socket.users[id]) socket.users[id].id = s.id;
            else {
              socket.users[id] = {
                id:s.id,
                friends:[],
                groups:[]
              } }
          }
          s.on('disconnect',()=>{
            delete socket.users[id];
          })

          s.on('joinRoom', (roomName) => {
            s.join(roomName);
          });
          s.on('leaveRoom', (roomName) => {
            s.leave(roomName);
          });
        })
      }


      
    })



}).catch((e)=>{
    console.log("error",e);
})
