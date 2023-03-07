
const jwt = require("jsonwebtoken");
const CustomErrorClass = require("../error/customErrorClass");
const RefreshToken = require("../models/refreshTokenModel");

const rtauth = async (req,res,next) => {
  const token = req.body.refreshToken
  if (!token) {
    return next(new CustomErrorClass("No refresh token found", 401));
  }
  try {
      const payload = jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET)
      req.user = payload.userId
      next()
  } catch (error) {
      if (error.name === "TokenExpiredError"){
          return next(new CustomErrorClass("The token has expired", 401))
      }
      return next (new CustomErrorClass("Not authorized to access this route", 401))
  }
}

module.exports = rtauth;
