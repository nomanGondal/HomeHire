const express = require("express");
const router = express.Router();
const { getMyCustomerProfile,updateMyCustomerProfile ,updateAddress,changePassword} = require("../controllers/customercontroller");
const {protect,restrictTo} = require("../middleware/authMiddleware");

router.get("/profile/me", protect,restrictTo("customer"), getMyCustomerProfile);
router.put("/profile/me", protect,restrictTo("customer"), updateMyCustomerProfile);
router.put("/profile/me/addresses", protect,restrictTo("customer"), updateAddress);
router.put("/profile/me/password", protect,restrictTo("customer"), changePassword);
module.exports = router;