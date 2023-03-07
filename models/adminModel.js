const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
require("dotenv").config();

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Must provide a name"],
    trim: true,
    maxlength: 30,
  },
  email: {
    type: String,
    required: [true, "Must provide an email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter a valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Must provide a password"],
    minlength: [8, "Password must be at least 8 characters long"],
  },
});

AdminSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

AdminSchema.methods.createAccessJWT = function () {
  return jwt.sign(
    { userId: this._id},
    process.env.JWT_ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.JWT_AT_LIFETIME }
  );
};

AdminSchema.methods.createRefreshJWT = function () {
  return jwt.sign(
    { userId: this._id},
    process.env.JWT_REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.JWT_RT_LIFETIME }
  );
};

AdminSchema.methods.comparePassword = async function (candidatePassword){
   const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch 
}

module.exports = mongoose.model("Admin", AdminSchema);
