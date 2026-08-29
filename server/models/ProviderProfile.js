const mongoose = require("mongoose");

const providerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one profile per provider
    },
    bio: {
      type: String,
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceCategory",
      },
    ],
    experienceYears: {
      type: Number,
      default: 0,
    },
    serviceAreas: [
      {
        city: { type: String, required: true },
        areas: [{ type: String }],
      },
    ],
    cnic: {
      number: { type: String },
      frontImageUrl: { type: String },
      backImageUrl: { type: String },
    },
    certificates: [
      {
        title: { type: String },
        fileUrl: { type: String },
      },
    ],
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
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
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    completedJobsCount: {
      type: Number,
      default: 0,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// 2dsphere index enables "find providers near this location" geo queries
providerProfileSchema.index({ location: "2dsphere" });
providerProfileSchema.index({ categories: 1 });
providerProfileSchema.index({ verificationStatus: 1 });

module.exports = mongoose.model("ProviderProfile", providerProfileSchema);