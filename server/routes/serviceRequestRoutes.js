const express = require("express");
const router = express.Router();
const { createServiceRequest,getMyRequests,getOpenRequests } = require("../controllers/serviceRequestController");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const { getQuotesForRequest } = require("../controllers/quotecontroller");

router.post("/openarequest", protect, restrictTo("customer"), createServiceRequest);
router.get("/my", protect, restrictTo("customer"), getMyRequests);
router.get("/open", protect, restrictTo("provider"), getOpenRequests);
router.get("/:id/quotes", protect, restrictTo("customer"), getQuotesForRequest);
module.exports = router;