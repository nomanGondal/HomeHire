import { io } from "socket.io-client";

let socket = null;

export const connectSocket = () => {
  console.log("Connecting to socket...");
  if (socket) return socket;

  const token = localStorage.getItem("token"); // use the same key you use for login
  socket = io("http://localhost:5000", { auth: { token } });
  console.log("Socket connected.");
  return socket;
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
  socket = null;
};