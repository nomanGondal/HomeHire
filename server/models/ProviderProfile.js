const mongoose = require("mongoose");
/*      businessName: "",
        bio: "",
        category: "",
        expertiseDescription: "",
        yearsOfExperience: "",
        hourlyRate: "",
        certificate: null,
        portfolioPhoto: null,
        serviceArea: "",
        travelDistance: "",*/
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
    services: [
      {
        category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ServiceCategory",
          required: true,
        },
        description: {
          type: String,
          trim: true,
        },
        hourlyRate: {
          type: Number,
          min: 0,
        },
        yearsOfExperience: {
          type: Number,
          default: 0,
        },
        isActive: {
          type: Boolean,
          default: true, // provider is/pause kar sake individual service
        },
      },
    ],

    certificate: {
      type: String,
    },
    portfolioPhoto: {
      type: String,
    },
    serviceArea: {
      type: String,
    },
    travelDistance: {
      type: Number,
      default: 0, // in kilometers
    },

    cnic: {
      number: { type: String },
      frontImageUrl: { type: String },
      backImageUrl: { type: String },
    },
    Photo: {
      type: String,
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
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