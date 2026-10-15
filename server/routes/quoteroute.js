const express = require("express");
const router = express.Router();
const { createQuote,acceptQuote,getProviderQuotes } = require("../controllers/quotecontroller");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.post("/", protect, restrictTo("provider"), createQuote);
router.put("/:id/accept", protect, restrictTo("customer"), acceptQuote);
router.get("/my", protect, restrictTo("provider"), getProviderQuotes);
module.exports = router;