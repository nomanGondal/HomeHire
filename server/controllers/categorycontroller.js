const ServiceCategory = require("../models/ServiceCategory");

// @route  GET /api/categories
const getCategories = async (req, res) => {
  try {
    const categories = await ServiceCategory.find({ isActive: true }).select(
      "name slug icon description"
    );

    res.status(200).json({ count: categories.length, categories });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getCategories };