const User = require("../models/User");
const CustomerProfile = require("../models/CustomerProfile");
const bcrypt = require("bcryptjs");

// @route  GET /api/customer/profile/me
const getMyCustomerProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const profile = await CustomerProfile.findOne({ user: req.user.id });

    res.status(200).json({ user, addresses: profile?.address || {} });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateMyCustomerProfile = async (req, res) => {
    console.log("Updating customer profile for user:", req.user.id, "with data:", req.body);
  try {

    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true, runValidators: true }
    ).select("-password");
    
    const profile = await CustomerProfile.findOne({ user: req.user.id });

    res.status(200).json({ user, addresses: profile?.address || {} });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const updateAddress = async (req, res) => {
  try {
    const { label, fullAddress, city, area } = req.body;

    if (!fullAddress || !city) {
      return res.status(400).json({ message: "Full address and city are required" });
    }

    const profile = await CustomerProfile.findOneAndUpdate(
      { user: req.user.id },
      { address: { label, fullAddress, city, area } },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ message: "Customer profile not found" });
    }

    res.status(200).json({ message: "Address saved successfully", address: profile.address });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }

    const user = await User.findById(req.user.id);

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword; // pre-save hook will hash it automatically
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = { getMyCustomerProfile, updateMyCustomerProfile, updateAddress, changePassword };