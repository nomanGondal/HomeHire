// Logic for signup, login, OTP verification will go here (empty for now)const User = require("../models/User");
const User = require("../models/User");
// @route  POST /api/auth/signup
const signup = async (req, res) => {
  try {
    const { name, phone, email, password, role } = req.body;
    if (!name || !phone || !password || !role) {
      return res.status(400).json({ message: "Name, phone, password, and role are required" });
    }

    // Never trust the client to sign up as admin
    if (!["customer", "provider"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this phone number already exists" });
    }

    const user = await User.create({ name, phone, email, password, role });

    res.status(201).json({
      message: "Account created successfully",
      user: { id: user._id, name: user.name, phone: user.phone, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { signup };