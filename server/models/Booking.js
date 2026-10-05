const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    serviceRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceRequest",
      required: true,
      unique: true, // one booking per request
    },
    quote: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quote",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceCategory",
      required: true,
    },
    scheduledDateTime: {
      type: Date,
    },
    address: {
      fullAddress: { type: String, required: true },
      city: { type: String, required: true },
      area: { type: String },
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["confirmed", "in-progress", "completed", "waiting-for-customer-confirmation", "cancelled", "disputed"],
      default: "confirmed",
    },
    cancellationReason: {
      type: String,
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

bookingSchema.index({ customer: 1 });
bookingSchema.index({ provider: 1 });
bookingSchema.index({ status: 1 });

module.exports = mongoose.model("Booking", bookingSchema);