const ProviderProfile = require("../models/ProviderProfile");
const categories = require("../models/ServiceCategory");
// @route  POST /api/provider/profile
const createProviderProfile = async (req, res) => {
  try {
    console.log(req.body);   // text fields: businessName, bio, category, etc.
    console.log(req.files);  // { certificate: [ {path, filename, ...} ], portfolioPhoto: [ {...} ] }

    const certificateFile = req.files?.certificate?.[0];
    const portfolioPhotoFile = req.files?.portfolioPhoto?.[0];

    const { businessName, bio,category,expertiseDescription,yearsOfExperience,hourlyRat ,serviceArea,travelDistance } = req.body;

    const existingProfile = await ProviderProfile.findOne({ user: req.user.id });
    if (existingProfile) {
      return res.status(400).json({ message: "Provider profile already exists" });
    }

    const profile = await ProviderProfile.create({
      user: req.user.id, // comes from the JWT via middleware, not from req.body
      businessName,
      bio,
      category,
      expertiseDescription,
      yearsOfExperience,
      hourlyRat,
      certificate: certificateFile ? certificateFile.path : null,
      portfolioPhoto: portfolioPhotoFile ? portfolioPhotoFile.path : null,
      serviceArea,
      travelDistance,
    });

    res.status(201).json({ message: "Provider profile created successfully", profile });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// @route  GET /api/provider/profile/me
const getMyProfile = async (req, res) => {
  try {
    const profile = await ProviderProfile.findOne({ user: req.user.id }).populate(
      "categories",
      "name slug"
    );

    if (!profile) {
      return res.status(404).json({ message: "Provider profile not found" });
    }

    res.status(200).json({ profile });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  PUT /api/provider/profile/me
const updateMyProfile = async (req, res) => {
  try {
    const { bio, skills, categories, experienceYears, serviceAreas } = req.body;

    const profile = await ProviderProfile.findOneAndUpdate(
      { user: req.user.id },
      { bio, skills, categories, experienceYears, serviceAreas },
      { new: true, runValidators: true } // return updated doc, still validate schema rules
    );

    if (!profile) {
      return res.status(404).json({ message: "Provider profile not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", profile });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  GET /api/provider/search
const searchProviders = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = { verificationStatus: "verified" }; // only show verified providers to customers
    if (category) {
      filter.categories = category; // expects a category _id
    }

    const providers = await ProviderProfile.find(filter)
      .populate("user", "name")
      .populate("categories", "name slug")
      .select("-cnic -certificates"); // don't expose sensitive docs publicly

    res.status(200).json({ count: providers.length, providers });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createProviderProfile, getMyProfile, updateMyProfile, searchProviders };