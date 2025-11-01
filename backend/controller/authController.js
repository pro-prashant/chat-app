const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const { tokenGeneration } = require("../middleware/token");

// 🟢 Signup
const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(404).json({ message: "All fields required" });
    }

    if (password.length < 6) {
      return res.status(404).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(404).json({ message: "User already exists" });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashpassword,
    });

    await newUser.save();

    if (newUser) {
      tokenGeneration(newUser._id, res);
      res.json(newUser);
    }
  } catch (error) {
    console.error("signup error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 🟢 Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const { password: _, ...userData } = user._doc;
    tokenGeneration(user._id, res);

    return res.status(200).json({
      message: "Login successful",
      user: userData,
    });
  } catch (error) {
    console.log("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 🟢 Logout
const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(202).json({ message: "Logout successfully" });
  } catch (error) {
    console.log(error, "Error in logout");
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 🟢 Update Profile Picture
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilepic: req.file.path },
      { new: true }
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 🟢 Get Logged-in User Profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user._id; // ✅ Comes from verifyToken middleware
    const user = await User.findById(userId).select("-password"); // remove password field

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { signup, login, logout, updateProfile, getProfile };
