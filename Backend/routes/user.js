import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js"; // Import User model

dotenv.config();

const router = express.Router();

// ✅ Get User Profile
router.get("/profile", async (req, res) => {
  try {
    // 🛠 Get token from headers
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    // 🔓 Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");

    // 🔍 Fetch user from DB (excluding password)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({ username: user.username, email: user.email, role: user.role });
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    res.status(500).json({ message: "Server error, try again later." });
  }
});

export default router;
