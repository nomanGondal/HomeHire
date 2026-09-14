const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRouthes");
const providerRoutes = require("./routes/providerRoute");
const categoryRoutes = require("./routes/categoryRoutes");
const serviceRequestRoutes = require("./routes/serviceRequestRoutes");
const quoteRoutes = require("./routes/quoteroute");
const bookingRoutes = require("./routes/bookingroutes");
const customerProfileRoutes = require("./routes/customerprofile");
const customerHomeRoutes = require("./routes/customerhome");
//Middlewares
const app = express();
app.use(cors());
app.use(express.json());
const PORT = 5000;
dotenv.config();
connectDB();



app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/provider", providerRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/requests", serviceRequestRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/customer", customerProfileRoutes);
app.use("/api/customerhome", customerHomeRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});