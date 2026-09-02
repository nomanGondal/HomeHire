const mongoose = require("mongoose");
/*  businessName,
    bio,
    category,
    expertiseDescription,
    yearsOfExperience,
    hourlyRate,
    certificate:optional,
    portfolioPhoto:optional,
    serviceArea,
    travelDistance,*/
const providerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one profile per provider
    },
    businessName: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    expertiseDescription: {
      type: [String],
      default: [],
    },
    yearsOfExperience: {
      type: Number,
      default: 0,
    },
    hourlyRate: {
      type: Number,
      default: 0,
    },
    









    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceCategory",
      },
    ],
    serviceAreas: [
      {
        city: { type: String, required: true },
        areas: [{ type: String }],
      },
    ],
    hourlyRate: {
      type: Number,
      default: 0,
    },
    portfolio: [
      {
        title: { type: String },
        imageUrl: { type: String },
      },
    ],
    travelDistance: {
      type: Number,
      default: 0, // in kilometers
    },
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
    Photo: {
      type: String,
    },

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