const jwt = require('jsonwebtoken');
const User = require('../models/user');
module.exports.generateAccessToken = function (username) {
    return jwt.sign(username, process.env.JWT_SECRET);
  }

  module.exports.isAutherize = async(req,res,next)=>{
    const token = req.headers['authorization'];
    if(token){
      jwt.verify(token,process.env.JWT_SECRET,async (err,id)=>{
        if(err){
          console.log(err);
          return res.sendStatus(403).json({msg:"bad request"});
        }
       let user = await User.findOne({where:{id}});
       if(user){
        req.user=user;
        return next();
       }else return res.sendStatus(403).json({msg:"user not found"})
      })
    }else return res.status(401).json({msg:"login first"});
  }
