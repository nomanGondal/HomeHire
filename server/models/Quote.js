const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
  {
    serviceRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceRequest",
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    message: {
      type: String,
      trim: true,
    },
    estimatedDuration: {
      type: String, // e.g. "2-3 hours"
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "withdrawn"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// One quote per provider per job — prevents duplicate bids
quoteSchema.index({ serviceRequest: 1, provider: 1 }, { unique: true });
quoteSchema.index({ status: 1 });

module.exports = mongoose.model("Quote", quoteSchema);