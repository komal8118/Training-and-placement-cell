
import express from "express";
import mongoose from "mongoose";
import Notification from "../models/Notification.js"; // ✅ Import Model

const router = express.Router();

// ✅ GET Notifications
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// ✅ POST (Create Notification)
router.post("/", async (req, res) => {
  try {
    const { message, date } = req.body;
    const newNotification = new Notification({ message, date: date || new Date() });
    await newNotification.save();

    res.status(201).json({ message: "Notification created successfully", newNotification });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: "Failed to create notification" });
  }
});

// ✅ DELETE Notification
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Check if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid notification ID" });
    }

    const deletedNotification = await Notification.findByIdAndDelete(id);
    
    if (!deletedNotification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: "Error deleting notification" });
  }
});


export default router;
