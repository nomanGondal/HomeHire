const Notifications = require("../models/Notifications");
const Booking = require("../models/Booking");
const serviceRequest = require("../models/ServiceRequest");
const getMyNotifications = async (req, res) => {
    console.log("Fetching notifications for user:", req.user.id);
  try {
    
    const notifications = await Notifications.find({ recipient: req.user.id })
    .populate("recipient", "name email")
    .populate("sender", "name email")
    .populate({
      path: "booking",
      select: "-status -customer -provider -address -completedAt -price -__v -_id -category -serviceRequest -quote -createdAt -updatedAt -scheduledDateTime",
      populate: {
          path:"serviceRequest",
          select: "description"
      }
    })
    .sort({ createdAt: -1 });
    res.status(200).json({ count: notifications.length, notifications });
    } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateNotificationStatus = async (req, res) => {
  const { notificationId } = req.params;
  const { status } = req.body;

  try {
    const notification = await Notifications.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    const booking = await Booking.findById(notification.booking);
    if (status === "accepted"){
      booking.status = "completed"; // Example: Mark the booking as completed
      await booking.save();
      const request = await serviceRequest.findById(booking.serviceRequest);
      request.status = "closed"; // Example: Mark the service request as closed
      await request.save();
      notification.status = "accepted";
      notification.isRead = true; // Mark the notification as read
      await notification.save();
    } else if (status === "rejected") {
      booking.status = "in-progress"; // Example: Mark the booking as in progress
      await booking.save();
      notification.status = "rejected";
      notification.isRead = true; // Mark the notification as read
      await notification.save();
    }
    res.status(200).json({ message: "Notification status updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getMyNotifications, updateNotificationStatus };