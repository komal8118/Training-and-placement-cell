

import express from "express";
import Interview from "../models/InterviewModel.js";
import nodemailer from "nodemailer";

const router = express.Router();

// ✅ Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-admin-email@gmail.com", // Replace with actual admin email
    pass: "your-email-password", // Use an App Password if 2FA is enabled
  },
});

// ✅ Schedule an Interview (POST)
router.post("/", async (req, res) => {
  try {
    console.log("Received Request:", req.body);

    let { studentId, slotId, companyName, interviewDetails, date, startTime, endTime } = req.body;

    if (!studentId || !slotId || !companyName || !interviewDetails || !date || !startTime || !endTime) {
      return res.status(400).json({ error: "All fields are required." });
    }

    date = new Date(date);

    const interview = new Interview({
      studentId,
      slotId,
      companyName,
      interviewDetails,
      date,
      startTime,
      endTime,
    });

    await interview.save();

    // ✅ Send Email Notification to Admin
    const mailOptions = {
      from: "your-admin-email@gmail.com",
      to: "admin-email@example.com", // Replace with the actual admin email
      subject: "New Interview Scheduled",
      text: `A new interview has been scheduled:
      - Company: ${companyName}
      - Student ID: ${studentId}
      - Date: ${date.toDateString()}
      - Time: ${startTime} - ${endTime}
      - Details: ${interviewDetails}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(201).json({ message: "Interview scheduled successfully", interview });

  } catch (error) {
    console.error("Error scheduling interview:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get all scheduled interviews (GET)
router.get("/", async (req, res) => {
  try {
    const interviews = await Interview.find();
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch interviews" });
  }
});

// ✅ Get an interview by ID (GET)
router.get("/:id", async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }
    res.json(interview);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch interview" });
  }
});

// ✅ Update an interview (PUT)
router.put("/:id", async (req, res) => {
  try {
    const updatedInterview = await Interview.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedInterview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    res.json({ message: "Interview updated successfully", updatedInterview });
  } catch (error) {
    console.error("Error updating interview:", error);
    res.status(500).json({ error: "Failed to update interview" });
  }
});

// ✅ Delete an interview (DELETE)
router.delete("/:id", async (req, res) => {
  try {
    const deletedInterview = await Interview.findByIdAndDelete(req.params.id);

    if (!deletedInterview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    res.json({ message: "Interview deleted successfully" });
  } catch (error) {
    console.error("Error deleting interview:", error);
    res.status(500).json({ error: "Failed to delete interview" });
  }
});

export default router;
