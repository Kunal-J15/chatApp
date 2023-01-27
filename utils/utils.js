const jwt = require('jsonwebtoken');
module.exports.generateAccessToken = function (username) {
    return jwt.sign(username, process.env.JWT_SECRET);
  }
