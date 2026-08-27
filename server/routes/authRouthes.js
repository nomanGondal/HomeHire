// Login, signup, OTP routes will be defined here (empty for now)const express = require("express");
const express = require("express");
const router = express.Router();
const { login, sendOtp,verifyOtp } = require("../controllers/authcontroller");

router.post("/login", login);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
module.exports = router;