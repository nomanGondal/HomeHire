const Booking = require("../models/Booking");

// @route  GET /api/bookings/my
const getMyBookings = async (req, res) => {
  try {
    // Build filter based on role — customer sees their bookings, provider sees theirs
    const filter =
      req.user.role === "customer"
        ? { customer: req.user.id }
        : { provider: req.user.id };

    const bookings = await Booking.find(filter)
      .populate("customer", "name phone")
      .populate("provider", "name phone")
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    res.status(200).json({ count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getMyBookings };