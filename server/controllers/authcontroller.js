// Logic for signup, login, OTP verification will go here (empty for now)const User = require("../models/User");
const Otp = require("../models/otp");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
/* @route  POST /api/auth/signup
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
*/

//POST /api/auth/login
const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "Phone and password are required" });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: "Invalid phone number or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid phone number or password" });
    }

    // Uncomment once OTP verification (Step 7) is built
    // if (!user.isPhoneVerified) {
    //   return res.status(403).json({ message: "Please verify your phone number first" });
    // }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, phone: user.phone, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




//POST /api/auth/otp/send
const sendOtp = async (req, res) => {
  try {
    const { name, phone, email, password, role } = req.body;

    if (!name || !phone || !password || !role) {
      return res.status(400).json({ message: "Name, phone, password, and role are required" });
    }
    if (!["customer", "provider"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this phone number already exists" });
    }

    await Otp.deleteMany({ phone }); // clear old pending attempts

    const code = Math.floor(10000 + Math.random() * 90000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.create({
      phone,
      code,
      expiresAt,
      payload: { name, phone, email, password, role }, // stored temporarily, plain password — deleted right after use
    });

    console.log(`OTP for ${phone}: ${code}`);

    res.status(200).json({ message: "OTP sent successfully", devOtp: code });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//POST /api/auth/otp/verify
const verifyOtp = async (req, res) => {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) {
      return res.status(400).json({ message: "Phone and code are required" });
    }

    const record = await Otp.findOne({ phone, code });
    if (!record) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const { name, email, password, role } = record.payload;

    const user = await User.create({
      name,
      phone,
      email,
      password, // gets hashed automatically via pre-save hook
      role,
      isPhoneVerified: true, // verified right at creation
    });

    await Otp.deleteOne({ _id: record._id }); // one-time use, remove pending data

    res.status(201).json({
      message: "Account verified and created successfully",
      user: { id: user._id, name: user.name, phone: user.phone, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
    };

module.exports = { login, sendOtp, verifyOtp };

