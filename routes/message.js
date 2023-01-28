const express =require("express");
const { route } = require("./user");
const router = express.Router({mergeParams:true});
const {isAutherize} = require("../utils/utils.js");
router.post("/",isAutherize,async(req,res,next)=>{
   const {text}=  req.body;
   await req.user.createMessage({msg:text});
res.status(200).json({msg:"saved"})
})

module.exports = router