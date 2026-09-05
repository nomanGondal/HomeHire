const express = require("express");
const router = express.Router();
const { createProviderProfile ,getMyProfile,updateMyProfile,searchProviders  } = require("../controllers/providercontroller");
const { protect ,restrictTo} = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.post("/profile", protect,restrictTo("provider"),upload.fields([
    { name: "certificate", maxCount: 1 },
    { name: "portfolioPhoto", maxCount: 1 },
  ]) , createProviderProfile);
  
router.get("/profile/me", protect, restrictTo("provider"), getMyProfile);

router.put("/profile/me", protect, upload.fields([
  { name: "certificate", maxCount: 1 },
  { name: "portfolioPhoto", maxCount: 1 },
]), updateMyProfile);

router.get("/search", searchProviders); // public — no auth needed

module.exports = router;