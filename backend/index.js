const express = require("express");
const dotenv = require("dotenv");
const DbConnected = require("./model/Db");
const authRoute = require("./route/authRoute");
const messageRoute = require("./route/messageRoute");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { app, server } = require("./middleware/socket.js");

dotenv.config();

// ✅ Use environment port or fallback
const PORT = process.env.PORT || 8000;

// ✅ Connect to MongoDB
DbConnected();

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ CORS (important for deployment)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // dynamic frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Routes
app.use("/auth", authRoute);
app.use("/message", messageRoute);

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("Server is running successfully 🚀");
});

// ✅ Start server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
