
import express from "express";
import Result from "../models/Result.js";

const router = express.Router();

// ✅ Create a new result
router.post("/", async (req, res) => {
  try {
    let { studentId, jobId, status, remarks, ctc } = req.body;

    // ✅ Validate required fields
    if (!studentId || !jobId || !status || ctc === undefined) {
      return res.status(400).json({ error: "Required fields are missing" });
    }

    // ✅ Ensure CTC is a valid number
    ctc = Number(ctc);
    if (isNaN(ctc) || ctc < 0) {
      return res.status(400).json({ error: "Invalid CTC value" });
    }

    const newResult = new Result({ studentId, jobId, status, remarks, ctc });
    await newResult.save();

    res.status(201).json({ message: "Result added successfully", result: newResult });
  } catch (error) {
    console.error("Error adding result:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});
// router.delete("/results/:id", async (req, res) => {
//   try {
//     const deletedResult = await Result.findByIdAndDelete(req.params.id);
//     if (!deletedResult) return res.status(404).json({ message: "Result not found" });

//     res.json({ message: "Result deleted successfully", deletedResult });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
// ✅ Get all results (with student & job details populated)
router.get("/", async (req, res) => {
  try {
    const results = await Result.find().populate("studentId jobId"); // Fetch with student & job details
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ Get a specific result by ID
router.get("/:id", async (req, res) => {
  try {
    const result = await Result.findById(req.params.id).populate("studentId jobId");
    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching result:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ Update a result
router.put("/:id", async (req, res) => {
  try {
    let { status, remarks, ctc } = req.body;

    if (ctc !== undefined) {
      ctc = Number(ctc);
      if (isNaN(ctc) || ctc < 0) {
        return res.status(400).json({ error: "Invalid CTC value" });
      }
    }

    const updatedResult = await Result.findByIdAndUpdate(
      req.params.id,
      { status, remarks, ctc },
      { new: true }
    );

    if (!updatedResult) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.status(200).json({ message: "Result updated successfully", result: updatedResult });
  } catch (error) {
    console.error("Error updating result:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ Delete a result
router.delete("/:id", async (req, res) => {
  try {
    const deletedResult = await Result.findByIdAndDelete(req.params.id);
    if (!deletedResult) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.status(200).json({ message: "Result deleted successfully" });
  } catch (error) {
    console.error("Error deleting result:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

export default router;
