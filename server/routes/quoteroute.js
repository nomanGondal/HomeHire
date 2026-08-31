const express = require("express");
const router = express.Router();
const { createQuote,acceptQuote } = require("../controllers/quotecontroller");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.post("/", protect, restrictTo("provider"), createQuote);
router.put("/:id/accept", protect, restrictTo("customer"), acceptQuote);
module.exports = router;