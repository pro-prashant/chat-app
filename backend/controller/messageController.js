const { cloudinary } = require("../middleware/cloudinary");
const MessageModel = require("../model/messageModel");
const UserModel = require("../model/userModel");
const { getReceiverSocketId, io } = require("../middleware/socket");

// ✅ Send Message
const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const senderId = req.user._id;
    const receiverId = req.params.id;

    if (!text && !image) {
      return res.status(400).json({ message: "Message text or image required" });
    }

    // Optional Cloudinary image upload
    let imageUrl = null;
    if (image) {
      const upload = await cloudinary.uploader.upload(image);
      imageUrl = upload.secure_url;
    }

    // Save message in database
    const newMessage = await MessageModel.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    // Send message in real-time via socket
    const receiverSocketIds = getReceiverSocketId(receiverId);
    const senderSocketIds = getReceiverSocketId(senderId);

    if (Array.isArray(receiverSocketIds)) {
      receiverSocketIds.forEach((id) => io.to(id).emit("newMessage", newMessage));
    }

    if (Array.isArray(senderSocketIds)) {
      senderSocketIds.forEach((id) => io.to(id).emit("newMessage", newMessage));
    }

    console.log("💬 Message Sent", { from: senderId.toString(), to: receiverId.toString() });

    return res.status(200).json({
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("❌ Error in sendMessage:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ✅ Get all messages between two users
const getAllMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.id;

    const messages = await MessageModel.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      message: "Messages fetched successfully",
      messages,
    });
  } catch (error) {
    console.error("❌ Error in getAllMessage:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ✅ Get all users except logged-in user
const contactForsidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const users = await UserModel.find({ _id: { $ne: loggedInUserId } }).select("-password");

    return res.status(200).json({
      message: "User list fetched successfully",
      users,
      currentUser: req.user,
    });
  } catch (error) {
    console.error("❌ Error in contactForsidebar:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  sendMessage,
  getAllMessage,
  contactForsidebar,
};
