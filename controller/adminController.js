require("dotenv").config();
const Admin = require("../models/adminModel");
const RefreshToken = require("../models/refreshTokenModel");
const jwt = require("jsonwebtoken");
const CustomErrorHandler = require("../error/customErrorClass");
const asyncWrapper = require("../middleware/asyncWrapper");

const register = asyncWrapper(async (req, res) => {
  console.log(req.body)
  console.log({...req.body})
  const admin = await Admin.create({ ...req.body });
  const accessToken = admin.createAccessJWT();
  const refreshToken = admin.createRefreshJWT();
  await RefreshToken.create({ refreshToken, owner: admin._id });
  res.status(201).json({ msg : "User registered successfully" ,user: admin.name, accessToken, refreshToken });
});

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      new CustomErrorHandler(
        "Please provide a valid email adderss and password",
        400
      )
    );
  }
  const admin = await Admin.findOne({ email });
  if (!admin) {
    return next(new CustomErrorHandler("Invalid email adderss", 401));
  }

  const isPasswordCorrect = await admin.comparePassword(password);
  if (!isPasswordCorrect) {
    return next(new CustomErrorHandler("Invalid Password", 401));
  }
  const accessToken = admin.createAccessJWT();
  const refreshToken = admin.createRefreshJWT();

  await RefreshToken.create({ refreshToken, owner: admin._id });
  res.status(200).json({
    userid: admin._id,
    username: admin.name,
    accessToken,
    refreshToken,
  });
};

const refreshToken = asyncWrapper(async (req, res, next) => {
  const refreshToken = req.body.refreshToken;

  const payload = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_TOKEN_SECRET
  );

  const owner = payload.userId;

  const refreshTokenExists = await RefreshToken.findOne({ owner });
  if (!refreshTokenExists) {
    return next(new CustomErrorHandler("Bad Request", 400));
  } else {
    const isRefreshTokenCorrect = await refreshTokenExists.compare(
      refreshToken
    );
    if (!isRefreshTokenCorrect) {
      return next(new CustomErrorHandler("Forbidden", 403));
    } else {
      const accessToken = jwt.sign(
        { userId: payload.userId },
        process.env.JWT_ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.JWT_AT_LIFETIME }
      );
      return res.status(200).json({ accessToken });
    }
  }
});

const deleteRT = asyncWrapper(async (req, res, next) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return next(new CustomErrorHandler("No refresh token found", 401));
  }
  const payload = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_TOKEN_SECRET
  );

  const owner = payload.userId;

  const refreshTokenExists = await RefreshToken.findOne({ owner });
  if (!refreshTokenExists) {
    return next(new CustomErrorHandler("Bad Request", 400));
  } else {
    const isRefreshTokenCorrect = await refreshTokenExists.compare(
      refreshToken
    );
    if (!isRefreshTokenCorrect) {
      return next(new CustomErrorHandler("Forbidden", 403));
    }
    await RefreshToken.deleteOne({ owner, refreshTokenExists });
    
    res.status(200).json({ msg: "User logged out successfully" });
  } 
});

const deleteAllAdmins = async (req, res) => {
  await Admin.deleteMany()
  res.status(200).json({ msg: " Admin deleted successfully" });
}

const deleteAllTokens = async (req, res) => {
  await RefreshToken.deleteMany()
  res.status(200).json({msg : "Deletion successful"})
}

module.exports = { register, login, refreshToken, deleteRT, deleteAllAdmins, deleteAllTokens };
