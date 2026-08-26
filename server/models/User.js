const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true, // one account per phone number
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // allows multiple docs with no email, but no duplicates if present
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true, // we'll hash this before saving — next step
    },
    role: {
      type: String,
      enum: ["customer", "provider", "admin"],
      required: true,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true, // admin can deactivate/suspend a user
    },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);