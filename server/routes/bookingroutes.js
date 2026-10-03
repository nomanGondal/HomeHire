const express = require("express");
const router = express.Router();
const { getMyBookings,updateBookingStatus } = require("../controllers/bookingcontroller");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.get("/my", protect, restrictTo("customer", "provider"), getMyBookings);
router.put("/:id/status", protect, restrictTo("provider"), updateBookingStatus);
module.exports = router;