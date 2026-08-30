const ServiceRequest = require("../models/ServiceRequest");

// @route  POST /api/requests
const createServiceRequest = async (req, res) => {
  try {
    const { category, description, urgency, preferredDateTime, address, location } = req.body;
console.log("Request body:", req.body); // Log the request body for debugging
    if (!category || !description || !address?.fullAddress || !address?.city) {
      return res.status(400).json({ message: "Category, description, and address are required" });
    }

    const request = await ServiceRequest.create({
      customer: req.user.id,
      category,
      description,
      urgency,
      preferredDateTime,
      address,
      location, // optional for now — can be added once you wire up maps
    });

    res.status(201).json({ message: "Service request created successfully", request });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createServiceRequest };