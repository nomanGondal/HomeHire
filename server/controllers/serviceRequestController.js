const ProviderProfile = require("../models/ProviderProfile");
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


// @route  GET /api/requests/my
const getMyRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ customer: req.user.id })
      .populate("category", "name slug")
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json({ count: requests.length, requests });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// @route  GET /api/requests/open
const getOpenRequests = async (req, res) => {
  try {
    // Get the logged-in provider's own profile to know their categories
    const providerProfile = await ProviderProfile.findOne({ user: req.user.id });

    if (!providerProfile) {
      return res.status(404).json({ message: "Provider profile not found. Please complete your profile first." });
    }

    if (!providerProfile.categories || providerProfile.categories.length === 0) {
      return res.status(400).json({ message: "No categories set on your profile yet" });
    }

    const requests = await ServiceRequest.find({
      status: "open",
      category: { $in: providerProfile.categories }, // matches any of provider's categories
    })
      .populate("category", "name slug")
      .populate("customer", "name") // just name, not sensitive info
      .sort({ createdAt: -1 });
 
    res.status(200).json({ count: requests.length, requests });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createServiceRequest, getMyRequests, getOpenRequests };


