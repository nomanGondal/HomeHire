const ProviderProfile = require("../models/ProviderProfile");
const Quote = require("../models/Quote");
const ServiceCategory = require("../models/ServiceCategory");
const ServiceRequest = require("../models/ServiceRequest");

// @route  POST /api/requests
const createServiceRequest = async (req, res) => {
  try {
    const {
      category,
      description,
      urgency,
      preferredDateTime,
      location,
      targetProvider, // optional — direct request to a specific provider
    } = req.body;

    console.log("Received service request data:", req.body);
    let address;
    try {
      address = typeof req.body.address === "string"
        ? JSON.parse(req.body.address)
        : req.body.address;
    } catch (parseErr) {
      return res.status(400).json({ message: "Invalid address format" });
    }
    if (!category || !description || !address?.fullAddress || !address?.city) {
      return res.status(400).json({ message: "Category, description, and address are required" });
    }
     const categoryExists = await ServiceCategory.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category" });
    }

    if (targetProvider) {
      const providerExists = await ProviderProfile.findOne({ user: targetProvider });
      if (!providerExists) {
        return res.status(400).json({ message: "Invalid target provider" });
      }
    }

    const request = await ServiceRequest.create({
      customer: req.user.id,
      category,
      description,
      urgency: typeof urgency === "string" ? urgency.trim().toLowerCase() : urgency,
      photos: req.files?.photos?.map((file) => file.path) || [],
      preferredDateTime,
      address,
      location,
      targetProvider: targetProvider || null, // stays null for open/general requests
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

    console.log("Provider profile:", providerProfile);

    if (!providerProfile) {
      return res.status(404).json({ message: "Provider profile not found. Please complete your profile first." });
    }

    if (!providerProfile.services || providerProfile.services.length === 0) {
      return res.status(400).json({ message: "No categories set on your profile yet" });
    }

    const requests = await ServiceRequest.find({
      status: ["open","quoted"], 
      $or:[
        {
          targetProvider:null,
           category: { $in: providerProfile.services
                            .filter((s) => s.isActive) // only consider active services
                            .map((s) => s.category) } // matches any of provider's categories
        } ,
        {
          targetProvider: req.user.id // direct requests to this provider
        } 
    ]
    })
    .populate("category", "name slug")
    .populate("customer", "name email")
    .select("-__v")
    .sort({ createdAt: -1 }); // newest first
 
    res.status(200).json({ count: requests.length, requests });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  PUT /api/requests/:id/cancel
const cancelRequest = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("the received ID =",id)
    const request = await ServiceRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Service request not found" });
    }

    // Only the owner can cancel their own request
    if (request.customer.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not allowed to cancel this request" });
    }

    // Already booked jobs shouldn't be cancelled this way — use booking cancellation instead
    if (request.status === "booked") {
      return res.status(400).json({ message: "This job is already booked. Cancel the booking instead." });
    }

    if (request.status === "cancelled") {
      return res.status(400).json({ message: "This request is already cancelled" });
    }

    request.status = "cancelled";
    await request.save();

    // Withdraw any pending quotes on this request — they're no longer valid
  
      
      await Quote.updateMany(
        { serviceRequest: id, status: "pending" },
        { status: "withdrawn" }
      );
    

    // TODO: trigger notification to providers who quoted — request cancelled

    res.status(200).json({ message: "Service request cancelled successfully", request });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



module.exports = { createServiceRequest, getMyRequests, getOpenRequests,cancelRequest };


