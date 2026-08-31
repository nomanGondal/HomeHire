const express = require("express");
const router = express.Router();
const { getMyBookings } = require("../controllers/bookingcontroller");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.get("/my", protect, restrictTo("customer", "provider"), getMyBookings);

module.exports = router;