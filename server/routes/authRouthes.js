// Login, signup, OTP routes will be defined here (empty for now)const express = require("express");
const express = require("express");
const router = express.Router();
const { signup } = require("../controllers/authcontroller");

router.post("/signup", signup);

module.exports = router;