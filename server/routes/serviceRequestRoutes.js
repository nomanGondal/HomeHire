const express = require("express");
const router = express.Router();
const { createServiceRequest } = require("../controllers/serviceRequestController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.post("/", protect, restrictTo("customer"), createServiceRequest);

module.exports = router;