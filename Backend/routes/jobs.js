
import express from "express";
import Job from "../models/Job.js";
import mongoose from "mongoose";
const router = express.Router();
router.post("/", async (req, res) => {
  try {
    console.log("🔍 Received job data:", req.body);

    const { title, company, location, description, requirement, qualification, ctc, roleDescription, agreement } = req.body;

    if (!title || !company || !location || !description || !requirement || !qualification || !ctc || !roleDescription || !agreement) {
      return res.status(400).json({ error: "All fields are required!" });
    }
    const jobData = { ...req.body, active: true };
    const newJob = new Job({ title, company, location, description, requirement, qualification, ctc, roleDescription, agreement });
    await newJob.save();

    res.status(201).json(newJob);
  } catch (error) {
    console.error("❌ Error creating job:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get all jobs
router.get("/", async (req, res) => {  // Fixed: Removed extra "/jobs"
  try {
    const jobs = await Job.find();
    const formattedJobs = jobs.map((job) => ({
      ...job.toObject(),
      appliedDate: job.appliedDate ? new Date(job.appliedDate).toISOString().split("T")[0] : "N/A",
      lastUpdated: job.lastUpdated ? new Date(job.lastUpdated).toISOString().split("T")[0] : "N/A",
    }));
    res.json(formattedJobs);
  } catch (err) {
    console.error("Error fetching jobs:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Update job status & lastUpdated date
router.put("/:id", async (req, res) => {  // Fixed: Removed extra "/jobs"
  try {
    const { status } = req.body;

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { status, lastUpdated: new Date() },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json({
      ...updatedJob.toObject(),
      appliedDate: updatedJob.appliedDate ? new Date(updatedJob.appliedDate).toISOString().split("T")[0] : "N/A",
      lastUpdated: new Date(updatedJob.lastUpdated).toISOString().split("T")[0],
    });
  } catch (err) {
    console.error("Error updating job:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// ✅ Update job status & lastUpdated date (Removed Duplicate)
router.put("/jobs/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { status, lastUpdated: new Date() },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json({
      ...updatedJob.toObject(),
      appliedDate: updatedJob.appliedDate ? new Date(updatedJob.appliedDate).toISOString().split("T")[0] : "N/A",
      lastUpdated: new Date(updatedJob.lastUpdated).toISOString().split("T")[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
      const { id } = req.params;

      // Check if ID is valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ error: "Invalid Job ID" });
      }

      // Find and delete the job
      const job = await Job.findByIdAndDelete(id);
      if (!job) {
          return res.status(404).json({ error: "Job not found" });
      }

      res.json({ message: "Job deleted successfully" });
  } catch (error) {
      console.error("Error deleting job:", error.message);
      res.status(500).json({ error: "Server error" });
  }
});

export default router;  // ✅ Corrected export for ES Modules
