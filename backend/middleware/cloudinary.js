require("dotenv").config();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up multer-storage-cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "chat-app",
    allowed_formats: ["jpg", "jpeg", "png"],
    public_id: (req, file) =>
      file.originalname
        .split(".")[0]
        .replace(/\s+/g, "_")
        .replace(/[^\w\-]/g, ""),
  },
});

const cloudinaryFileUploader = multer({ storage });

module.exports = { cloudinary, cloudinaryFileUploader };
