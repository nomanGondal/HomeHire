const express = require("express");
const router = express.Router();
const { createServiceRequest,getMyRequests,getOpenRequests, cancelRequest } = require("../controllers/serviceRequestController");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const { getQuotesForRequest } = require("../controllers/quotecontroller");
const upload = require("../middleware/upload");
router.post("/openarequest", protect, restrictTo("customer"),upload.fields([{ name: "photos", maxCount: 5 }]), createServiceRequest);
router.get("/my", protect, restrictTo("customer"), getMyRequests);
router.get("/open", protect, restrictTo("provider"), getOpenRequests);
router.get("/:id/quotes", protect, restrictTo("customer"), getQuotesForRequest);
router.put("/:id/cancel",protect , restrictTo("customer"),cancelRequest)
module.exports = router;