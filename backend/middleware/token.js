
const jwt = require("jsonwebtoken");

const tokenGeneration = (userId, res) => {
  try {
    console.log("🟢 [tokenGeneration] Starting token creation...");
    console.log("User ID:", userId);
    console.log("JWT_SECRET from .env:", process.env.JWT_SECRET ? "Loaded ✅" : "❌ Missing");

    // Generate token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log("Generated JWT Token:", token);

    // Set cookie
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      sameSite: "strict",
    });

    console.log("✅ [tokenGeneration] Token cookie successfully set on response.");
  } catch (error) {
    console.error("❌ [tokenGeneration] Error generating token:", error.message);
  }
};

module.exports = { tokenGeneration };
