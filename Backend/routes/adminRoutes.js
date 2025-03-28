import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Adminregister, login, createCompany, deleteCompany } from "../controller/adminController.js";

dotenv.config();

const router = express.Router();
const secretKey = process.env.JWT_SECRET || "your_secret_key";

// ✅ Middleware to verify JWT token 
const verifyToken = (req, res, next) => {
  const token = req.cookies?.jwt_token; // Use optional chaining
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    req.adminId = decoded.adminId;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// ✅ Admin Routes
router.post("/admin-register", Adminregister);
router.post("/adminlogin", login);
router.post("/createCompany", verifyToken, createCompany);
router.delete("/deleteCompany/:companyId", verifyToken, deleteCompany);

export default router;
