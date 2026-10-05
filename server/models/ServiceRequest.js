const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceCategory",
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    urgency: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    preferredDateTime: {
      type: Date,
    },
    photos: {
      type: [String], // Cloudinary URLs — wired up later
      default: [],
    },
    address: {
      fullAddress: { type: String, required: true },
      city: { type: String, required: true },
      area: { type: String },
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        default: [0, 0],
      },
    },
    status: {
      type: String,
      enum: ["open","quoted" ,"booked","closed", "cancelled", "expired"],
      default: "open",
    },


    targetProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
  },


  { timestamps: true }
);

serviceRequestSchema.index({ location: "2dsphere" });
serviceRequestSchema.index({ customer: 1 });
serviceRequestSchema.index({ category: 1 });
serviceRequestSchema.index({ status: 1 });

module.exports = mongoose.model("ServiceRequest", serviceRequestSchema);