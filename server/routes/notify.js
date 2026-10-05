const express = require("express");
const router = express.Router();
const { getMyNotifications,updateNotificationStatus } = require("../controllers/notifiation");
const { protect, restrictTo } = require("../middleware/authMiddleware");
router.get("/my", protect, restrictTo("customer"), getMyNotifications);
router.put("/:notificationId/respond", protect, restrictTo("customer"), updateNotificationStatus);
module.exports = router;
