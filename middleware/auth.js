const Admin = require("../models/adminModel");
const jwt = require("jsonwebtoken");
const CustomErrorClass = require("../error/customErrorClass");


const auth = (req,res,next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer")){
        return next (new CustomErrorClass("Authentication Invalid", 401))
    }
    const token = authHeader.split(" ")[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, process.env.JWT_AT_LIFETIME)
        req.user = payload.userId
        next()
    } catch (error) {
        if (error.name === "TokenExpiredError"){
            return next(new CustomErrorClass("The token has expired", 401))
        }
        return next (new CustomErrorClass("Not authorized to access this route", 401))
    }
}


module.exports = auth