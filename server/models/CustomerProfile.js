const mongoose = require("mongoose");

const customerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    address:
      {
        label: { type: String, }, // "Home", "Office", etc.
        fullAddress: { type: String,  },
        city: { type: String, },
        area: { type: String },
      },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomerProfile", customerProfileSchema);