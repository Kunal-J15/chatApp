const express =require("express");
const router = express.Router({mergeParams:true});
const {isAutherize} = require("../utils/utils.js");
const Message = require("../models/message");
const User = require("../models/user");
const { Op } = require("sequelize");

router.get("/",isAutherize,)