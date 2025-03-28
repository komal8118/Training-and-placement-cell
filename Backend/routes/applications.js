

import express from "express";
import Application from "../models/JobApplication.js"; // Ensure this model exists

const router = express.Router();

// ✅ Fetch applications by jobId
router.get("/job/:jobId", async (req, res) => {
    try {
        const { jobId } = req.params;

        if (!jobId) {
            return res.status(400).json({ message: "Job ID is required" });
        }

        const applications = await Application.find({ jobId })
            .populate("studentId", "username email");

        if (!applications || applications.length === 0) {
            return res.status(404).json({ message: "No applications found for this Job ID" });
        }

        res.json(applications);
    } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ message: "Error fetching applications" });
    }
});

// ✅ Fetch a single application by application ID
router.get("/:appId", async (req, res) => {
    try {
        const { appId } = req.params;

        if (!appId) {
            return res.status(400).json({ message: "Application ID is required" });
        }

        const application = await Application.findById(appId)
            .populate("studentId", "username email");

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        res.json(application);
    } catch (error) {
        console.error("Error fetching application:", error);
        res.status(500).json({ message: "Error fetching application" });
    }
});

// ✅ Update application status
router.patch("/:appId", async (req, res) => {
    try {
        const { appId } = req.params;
        const { status } = req.body;

        if (!appId) {
            return res.status(400).json({ message: "Application ID is required" });
        }

        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        const application = await Application.findByIdAndUpdate(
            appId,
            { status },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        res.json({ message: "Application updated successfully", application });
    } catch (error) {
        console.error("Error updating application:", error);
        res.status(500).json({ message: "Error updating application status" });
    }
});

export default router;
