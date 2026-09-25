const ProviderProfile = require("../models/ProviderProfile");

// @route  GET /api/customer/providers
const getAvailableProviders = async (req, res) => {
  try {
    const { category, city } = req.query;
     
    const filter = { 
verificationStatus: "pending" };

    if (category) {
      filter["services.category"] = category;
    }
    if (city) {
      filter["serviceAreas.city"] = city; // matches providers serving that city
    }
   
    const providers = await ProviderProfile.find(filter)
      .populate("user", "name")
      .populate("services.category", "name slug")
      .select("-cnic -certificates")
      .sort({ "rating.average": -1 }); // best-rated first

    res.status(200).json({ count: providers.length, providers });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAvailableProviders
};