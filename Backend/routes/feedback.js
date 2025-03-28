import express from "express";
import Feedback from "../models/Feedback.js";

const router = express.Router();

// Submit Feedback/Issue
router.post("/", async (req, res) => {
  try {
    const { userId, name, email, type, message } = req.body;

    const feedback = new Feedback({ userId, name, email, type, message });
    await feedback.save();

    res.status(201).json({ success: true, message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get All Feedbacks (Admin)
router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update Feedback Status (Admin)
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    await Feedback.findByIdAndUpdate(req.params.id, { status });
    res.json({ success: true, message: "Feedback status updated" });
  } catch (error) {
    console.error("Error updating feedback:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }

    res.json({ success: true, message: "Feedback deleted successfully" });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
