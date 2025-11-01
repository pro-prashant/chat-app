const express = require("express");
const router = express.Router();
const { signup, login, logout, updateProfile, getProfile } = require("../controller/authController");
const { cloudinaryFileUploader } = require("../middleware/cloudinary");
const {checkAuth} = require("../middleware/authMiddleware");


// Routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/getprofile" ,checkAuth, getProfile);

// ✅ Secure update profile route
router.put(
  "/update-profile",
    checkAuth,// must come before multer
  cloudinaryFileUploader.single("profilepic"),
  updateProfile
);

module.exports = router;
