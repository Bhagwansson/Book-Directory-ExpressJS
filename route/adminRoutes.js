const express = require('express');
const router = express.Router();
const rtAuth = require("../middleware/rtAuth")
const {register,login, refreshToken, deleteRT, deleteAllAdmins, deleteAllTokens} = require("../controller/adminController")

router.post("/register", register);
router.post("/login", login);
router.post("/token", rtAuth, refreshToken);
router.delete("/logout", deleteRT)
router.delete("/delete", deleteAllAdmins);
router.delete("/deletert", deleteAllTokens)


module.exports = router;