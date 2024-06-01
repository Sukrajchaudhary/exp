const express = require("express");
const router = express.Router();
const { sendOTP, verifyOTP } = require("../controllers/Otp.controller");
router.post("/sendOTP", sendOTP).post("/verifyOtp", verifyOTP);
exports.router = router;
