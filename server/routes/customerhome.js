const express = require("express");
const router = express.Router();
const { getAvailableProviders } = require("../controllers/customer");
const { protect, restrictTo } = require("../middleware/authMiddleware");
router.get("/providers", protect, restrictTo("customer"), getAvailableProviders);

module.exports = router;