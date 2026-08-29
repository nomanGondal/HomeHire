const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRouthes");
const providerRoutes = require("./routes/providerRoute");
const app = express();
app.use(cors());
app.use(express.json());
const PORT = 5000;
dotenv.config();
connectDB();
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/provider", providerRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});