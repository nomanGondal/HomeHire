const Booking = require("../models/Booking");
const Quote = require("../models/Quote");
const ServiceRequest = require("../models/ServiceRequest");
const providerprofile=require("../models/ProviderProfile");
const ProviderProfile = require("../models/ProviderProfile");
// @route  POST /api/quotes
const createQuote = async (req, res) => {
  try {
    const { serviceRequest, price, message, estimatedDuration } = req.body;

    if (!serviceRequest || !price) {
      return res.status(400).json({ message: "Service request and price are required" });
    }

    const request = await ServiceRequest.findById(serviceRequest);
    if (!request) {
      return res.status(404).json({ message: "Service request not found" });
    }

    // Job must still be open/quoted (not already booked/cancelled)
    if (!["open", "quoted"].includes(request.status)) {
      return res.status(400).json({ message: "This job is no longer accepting quotes" });
    }

    // If request is targeted to a specific provider, only they can quote
    if (request.targetProvider && request.targetProvider.toString() !== req.user.id) {
      return res.status(403).json({ message: "This request is not addressed to you" });
    }

    const quote = await Quote.create({
      serviceRequest,
      provider: req.user.id,
      price,
      message,
      estimatedDuration,
    });

    // Mark request as "quoted" (only meaningfully changes on the first quote)
    if (request.status === "open") {
      request.status = "quoted";
      await request.save();
    }

    // TODO: trigger notification to customer — new quote received

    res.status(201).json({ message: "Quote submitted successfully", quote });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "You have already submitted a quote for this job" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




// @route  GET /api/requests/:id/quotes
const getQuotesForRequest = async (req, res) => {
  try {
    const { id } = req.params; // serviceRequest id

    const request = await ServiceRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Service request not found" });
    }

    // Only the customer who owns this request can view its quotes
    if (request.customer.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not allowed to view these quotes" });
    }

    const quotes = await Quote.find({ serviceRequest: id, status: { $ne: "withdrawn" } })
      .populate("provider",["name","_id"])
      .sort({ price: 1 }); // cheapest first — customer can re-sort on frontend if needed
    res.status(200).json({ count: quotes.length, quotes });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// @route  PUT /api/quotes/:id/accept
const acceptQuote = async (req, res) => {
  try {
    const { id } = req.params; // quote id

    const quote = await Quote.findById(id);
    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    const request = await ServiceRequest.findById(quote.serviceRequest);
    if (!request) {
      return res.status(404).json({ message: "Service request not found" });
    }

    // Only the request's owner can accept a quote on it
    if (request.customer.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not allowed to accept this quote" });
    }

    if (request.status === "booked") {
      return res.status(400).json({ message: "This job is already booked" });
    }

    // 1. Mark this quote accepted
    quote.status = "accepted";
    await quote.save();

    // 2. Reject all other quotes on this request
    await Quote.updateMany(
      { serviceRequest: request._id, _id: { $ne: quote._id } },
      { status: "rejected" }
    );

    // 3. Mark the request as booked
    request.status = "booked";
    await request.save();

    // 4. Create the booking — denormalized fields for fast dashboard queries
    const booking = await Booking.create({
      serviceRequest: request._id,
      quote: quote._id,
      customer: request.customer,
      provider: quote.provider,
      category: request.category,
      scheduledDateTime: request.preferredDateTime,
      address: request.address,
      price: quote.price,
    });

    res.status(201).json({ message: "Quote accepted, booking created", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createQuote, getQuotesForRequest, acceptQuote };
