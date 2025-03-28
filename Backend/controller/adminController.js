import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Admin from "../models/admin.js"; 

dotenv.config();

const secretKey = process.env.JWT_SECRET || "your_secret_key";

// ✅ Register Admin
export const Adminregister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ name, email, password: hashedPassword });

    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully" });

  } catch (error) {
    console.error("Error in admin registration:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Admin Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin in the database
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ adminId: admin._id }, secretKey, { expiresIn: "1h" });
    res.cookie("jwt_token", token, { httpOnly: true });

    res.status(200).json({ message: "Login successful", token });

  } catch (error) {
    console.error("Error in admin login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Create a Company (Example Function)
export const createCompany = async (req, res) => {
  try {
    const { name, location, industry } = req.body;

    // Example: Save company details to database
    const newCompany = { name, location, industry }; // Replace with actual model
    console.log("Company Created:", newCompany);
    
    res.status(201).json({ message: "Company created successfully", company: newCompany });
  } catch (error) {
    console.error("Error in creating company:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Delete a Company (Example Function)
export const deleteCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    // Example: Remove company from database
    console.log("Company Deleted:", companyId);
    
    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    console.error("Error in deleting company:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
