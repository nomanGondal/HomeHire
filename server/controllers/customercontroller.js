const User = require("../models/User");
const CustomerProfile = require("../models/CustomerProfile");
const bcrypt = require("bcryptjs");

// @route  GET /api/customer/profile/me
const getMyCustomerProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const profile = await CustomerProfile.findOne({ user: req.user.id });

    res.status(200).json({ user, addresses: profile?.addresses || [] });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getMyCustomerProfile };