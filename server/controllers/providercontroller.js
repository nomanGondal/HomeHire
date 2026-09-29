const ProviderProfile = require("../models/ProviderProfile");
const categories = require("../models/ServiceCategory");
// @route  POST /api/provider/profile
const createProviderProfile = async (req, res) => {
  try {
    const certificateFile = req.files?.certificate?.[0];
    const portfolioPhotoFile = req.files?.portfolioPhoto?.[0];

    const { businessName, bio, services, serviceArea, travelDistance, } = req.body;
  
    let parsedServices;

try {
  const services = req.body.services;
  parsedServices = typeof services === "string" ? JSON.parse(services) : services;

} catch (parseErr) {
  return res.status(400).json({ message: "Invalid services format" });
}

if (!Array.isArray(parsedServices) || parsedServices.length === 0) {
  return res.status(400).json({ message: "At least one service is required" });
}


    if (!Array.isArray(parsedServices) || parsedServices.length === 0) {
      return res.status(400).json({ message: "At least one service is required" });
    }

    // Har service entry validate karein
    for (const service of parsedServices) {
      if (!service.category || service.hourlyRate === undefined) {
        return res.status(400).json({
          message: "Each service must have a category and hourly rate",
        });
      }
    }

    const existingProfile = await ProviderProfile.findOne({ user: req.user.id });
    if (existingProfile) {
      return res.status(400).json({ message: "Provider profile already exists" });
    }

    const profile = await ProviderProfile.create({
      user: req.user.id, // JWT se aata hai, req.body se nahi
      businessName,
      bio,
      services: parsedServices.map((s) => ({
        category: s.category,
        description: s.description || "",
        hourlyRate: s.hourlyRate,
        yearsOfExperience: s.yearsOfExperience,
        isActive: true,
      })),
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
      "services.category",
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
    const { businessName, bio, services, serviceArea, travelDistance } = req.body;

    const updateData = {};

    // Sirf jo fields bheji gayi hain unhe hi update karo (partial update support)
    if (businessName !== undefined) updateData.businessName = businessName;
    if (bio !== undefined) updateData.bio = bio;
    if (serviceArea !== undefined) updateData.serviceArea = serviceArea;
    if (travelDistance !== undefined) updateData.travelDistance = travelDistance;

    // services agar bheji gayi hai to parse aur validate karo
    if (services !== undefined) {
      let parsedServices;

      try {
        parsedServices = typeof services === "string" ? JSON.parse(services) : services;
      } catch (parseErr) {
        return res.status(400).json({ message: "Invalid services format" });
      }

      if (!Array.isArray(parsedServices) || parsedServices.length === 0) {
        return res.status(400).json({ message: "At least one service is required" });
      }

      for (const service of parsedServices) {
        if (!service.category || service.hourlyRate === undefined) {
          return res.status(400).json({
            message: "Each service must have a category and hourly rate",
          });
        }
      }

      updateData.services = parsedServices.map((s) => ({
        category: s.category,
        description: s.description || "",
        hourlyRate: s.hourlyRate,
        yearsOfExperience: s.yearsOfExperience,
        isActive: s.isActive !== undefined ? s.isActive : true,
      }));
    }

    // Agar naya certificate/photo upload hui hai to wo bhi update karo
    const certificateFile = req.files?.certificate?.[0];
    const portfolioPhotoFile = req.files?.portfolioPhoto?.[0];
    if (certificateFile) updateData.certificate = certificateFile.path;
    if (portfolioPhotoFile) updateData.portfolioPhoto = portfolioPhotoFile.path;

    const profile = await ProviderProfile.findOneAndUpdate(
      { user: req.user.id },
      updateData,
      { new: true, runValidators: true }
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