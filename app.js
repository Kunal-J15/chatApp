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



app.use(cors({
    origin:"*",
}))
app.use(express.urlencoded({extended:true}));
app.use(express.json())

app.use(express.static(__dirname + '/public'));


app.use("/user",userRoute);
app.use('/message',messageRoute);

app.get("/",(req,res,next)=>{
  console.log("in");
  res.render("index")
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
Group.belongsTo(User, { as: 'admin', foreignKey: 'adminId' });

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

  // User.belongsToMany(User, {
  //   as: 'sender',
  //   through: 'friendship',
  //   foreignKey: 'senderId',
  //   otherKey: 'friendId'
  // });

//   Message.belongsTo(User,{through:"Conversation"});
// User.belongsTo(Message,{through:"Conversation"});

// Group.belongsTo(User, { as: 'admin', foreignKey: 'adminId' });

// Group.hasMany(User);
// User.belongsToMany(Group, { through: 'UserGroup' });

// Group.hasMany(Message);
// Message.belongsTo(Group);

// User.belongsToMany(User, {
//     as: 'friends',
//     through: 'friendship',
//     foreignKey: 'userId',
//     otherKey: 'friendId'
//   });

// async function name(params) {
//   await sequelize.query('ALTER TABLE friendship DROP FOREIGN KEY friendship_ibfk_1');
//  await sequelize.sync({ force: true });
// };
// name();

var option //= {force: true}
sequelize.sync(option
).then(async()=>{
    if(option){
        const hash = bcrypt.hashSync("a", 10);
        const user1 = User.build({ name:"a", email:"a@gmail.com", password: hash, number:9866393399 });
        const user2 = User.build({ name:"ab", email:"ab@gmail.com", password: hash, number:9999999999 });
        const user3 = User.build({ name:"c", email:"c@gmail.com", password: hash, number:123456789 });
        const user4 = User.build({ name:"d", email:"d@gmail.com",password: hash,number:01234567});
        //snf
         await user1.save();await user2.save();await user3.save();await user4.save();
        const ans2 = await Promise.all([user1.addFriend(user2.id),user1.addFriend(user3.id),user1.addFriend(user4.id),user2.addFriend(user1.id),user3.addFriend(user4.id),user4.addFriend(user3.id)]);
    }
    app.listen(3000,()=>{console.log("listning on 3000");})
}).catch((e)=>{
    console.log("error",e);
})
