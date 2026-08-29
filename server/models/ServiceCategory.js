const mongoose = require("mongoose");

const serviceCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true, // URL-safe identifier, e.g. "ac-technician"
      lowercase: true,
    },
    icon: {
      type: String, // icon name or URL, wire up later with actual assets
    },
    description: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true, // lets admin retire a category without deleting history
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceCategory", serviceCategorySchema);