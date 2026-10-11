const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const http = require("http");
const {Server} =require("socket.io")
const cors = require("cors");
const app = express();
const initializeSocket =require("./socketio/initializeSocket.js");


const server=http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

app.use(cors({ origin: "http://localhost:5173" }));

//DB connection 
const connectDB = require("./config/db");

//Routes
const authRoutes = require("./routes/authRouthes");
const providerRoutes = require("./routes/providerRoute");
const categoryRoutes = require("./routes/categoryRoutes");
const serviceRequestRoutes = require("./routes/serviceRequestRoutes");
const quoteRoutes = require("./routes/quoteroute");
const bookingRoutes = require("./routes/bookingroutes");
const customerProfileRoutes = require("./routes/customerprofile");
const customerHomeRoutes = require("./routes/customerhome");
const notificationRoutes = require("./routes/notify");
//Middlewares
app.set("io",io)
initializeSocket(io);
app.use(express.json());
const PORT = 5000;
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
app.use("/api/notifications", notificationRoutes);


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});