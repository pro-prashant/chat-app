// backend/route/messageRoute.js
const express = require("express");
const {
  contactForsidebar,
  getAllMessage, // ✅ Fix here
  sendMessage,
} = require("../controller/messageController");
const { checkAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all users except logged-in user
router.get("/users", checkAuth, contactForsidebar);

// Get messages for a specific user
router.get("/getMessage/:id", checkAuth, getAllMessage); // ✅ Use correct function

// Send a message to a specific user
router.post("/sendMessage/:id", checkAuth, sendMessage);

module.exports = router;
