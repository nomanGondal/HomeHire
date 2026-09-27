const express = require("express");
const router = express.Router();
const { getAvailableProviders,getProviderProfileById } = require("../controllers/customer");
const { protect, restrictTo } = require("../middleware/authMiddleware");
router.get("/providers", protect, restrictTo("customer"), getAvailableProviders);
router.get("/providerprofile/:id",protect,restrictTo("customer"),getProviderProfileById)
module.exports = router;