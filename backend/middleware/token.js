const jwt = require("jsonwebtoken");

const tokenGeneration = (userId, res) => {
  try {
    console.log("🟢 [tokenGeneration] Starting token creation...");
    console.log("User ID:", userId);
    console.log("JWT_SECRET from .env:", process.env.JWT_SECRET ? "Loaded ✅" : "❌ Missing");

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Set cookie
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // secure only in prod
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    console.log("✅ Token cookie successfully set on response.");
  } catch (error) {
    console.error("❌ Error generating token:", error.message);
  }
};

module.exports = {tokenGeneration};
