const Booking = require("../models/Booking");
const ServiceRequest = require("../models/ServiceRequest");
const Quote = require("../models/Quote");

// @route  PUT /api/quotes/:id/accept
const acceptQuote = async (req, res) => {
  try {
    const { id } = req.params; // quote id
    console.log("Received quote ID to accept:", id);
    const quote = await Quote.findById(id);
    console.log("Fetched quote:", quote);
    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }
    
    const request = await ServiceRequest.findById(quote.serviceRequest);
    console.log("Fetched service request:", request);
    if (!request) {
      return res.status(404).json({ message: "Service request not found" });
    }

        // Only the customer who owns this request can accept a quote on it
    if (request.customer.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not allowed to accept this quote" });
    }

    // Prevent accepting a quote on an already-booked or cancelled request
    if (request.status === "booked") {
      return res.status(400).json({ message: "This job is already booked" });
    }

    if (request.status === "cancelled") {
      return res.status(400).json({ message: "This request has been cancelled" });
    }

    // Safety check: the quote itself shouldn't already be accepted/rejected
    if (quote.status !== "pending") {
      return res.status(400).json({ message: "This quote is no longer available" });
    }

        // 1. Mark this quote as accepted
    quote.status = "accepted";
    await quote.save();

    // 2. Reject all other pending quotes on this same request
    await Quote.updateMany(
      { serviceRequest: request._id, _id: { $ne: quote._id }, status: "pending" },
      { status: "rejected" }
    );

     // 3. Mark the request as booked — removes it from open/quoted listings
    request.status = "booked";
    await request.save();

        // 4. Create the booking — address from request, price from quote
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

    // TODO: trigger notification — customer confirmed booking, notify provider
    // TODO: trigger notification — other providers' quotes were rejected, notify them
    console.log("Booking created:", booking);
    res.status(201).json({ message: "Booking confirmed successfully", booking });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}; 
// @route  GET /api/bookings/my
const getMyBookings = async (req, res) => {
  try {
    // Build filter based on role — customer sees their bookings, provider sees theirs
    const filter =
      req.user.role === "customer"
        ? { customer: req.user.id }
        : { provider: req.user.id };

    const bookings = await Booking.find(filter)
      .populate("customer", "name phone")
      .populate("provider", "name phone")
      .populate("category", "name slug")
      .populate("serviceRequest", "description")
      
      .sort({ createdAt: -1 });

    res.status(200).json({ count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getMyBookings, acceptQuote };