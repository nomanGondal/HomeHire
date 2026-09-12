const express = require("express");
const router = express.Router();
const { getMyCustomerProfile } = require("../controllers/customercontroller");
const {protect,restrictTo} = require("../middleware/authMiddleware");

router.get("/profile/me", protect,restrictTo("customer"), getMyCustomerProfile);

module.exports = router;