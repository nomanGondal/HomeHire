
const jwt = require("jsonwebtoken");

function initializeSocket(io) {
  // Verify JWT
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  // Connection and room logic
  io.on("connection", (socket) => {
    socket.join(String(socket.userId));

    console.log("User connected:", socket.userId);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.userId);
    });
  });
}

module.exports = initializeSocket;
