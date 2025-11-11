const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const userSocket = {}; // { userId: [socketIds] }

// ✅ Use env variable for CORS origin
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// ✅ Helper to get all socket IDs for a user
const getReceiverSocketId = (userId) => userSocket[userId];

// ✅ Socket connection
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    if (!userSocket[userId]) userSocket[userId] = [];
    userSocket[userId].push(socket.id);
    console.log(`🟢 [CONNECT] User: ${userId} | Socket: ${socket.id}`);
  }

  // ✅ Emit updated online users list to all clients
  io.emit("getOnlineUsers", Object.keys(userSocket));

  // ✅ Listen for sendMessage event
  socket.on("sendMessage", (message) => {
    const receiverId = message.receiverId;
    const receiverSockets = getReceiverSocketId(receiverId);

    if (receiverSockets && receiverSockets.length > 0) {
      receiverSockets.forEach((id) => {
        io.to(id).emit("newMessage", message);
      });
    }
  });

  // ✅ Handle disconnect
  socket.on("disconnect", () => {
    console.log(`🔴 [DISCONNECT] Socket: ${socket.id}`);
    for (const userId in userSocket) {
      userSocket[userId] = userSocket[userId].filter((id) => id !== socket.id);
      if (userSocket[userId].length === 0) delete userSocket[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocket));
  });
});

module.exports = { app, server, io, getReceiverSocketId };
