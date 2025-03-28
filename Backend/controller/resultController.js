

import mongoose from "mongoose";
import Result from "../models/Result.js";

// ✅ Create a new result
export const createResult = async (req, res) => {
  try {
    const { studentId, jobId, status, remarks } = req.body;

    if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid Student ID or Job ID format" });
    }

    const newResult = new Result({ studentId, jobId, status, remarks });
    await newResult.save();

    res.status(201).json({ message: "Result added successfully", result: newResult });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Get all results (Updated to avoid "N/A" issues)
export const getAllResults = async (req, res) => {
  try {
    const results = await Result.find()
    .populate({ path: "studentId", select: "name _id" }) // Fetch student name & ID
    .populate({ path: "jobId", select: "title company salary" });
    const formattedResults = results.map((result) => ({
      _id: result?._id || "N/A",
      studentId: result?.studentId?._id || "N/A",
      studentName: result?.studentId?.name || "N/A", // Get from populated student
      companyName: result?.jobId?.companyName || "N/A", // Get from populated job
      jobId: result?.jobId?._id || "N/A",
      role: result?.jobId?.role || "N/A",
      ctc: result?.jobId?.ctc || "N/A",
      status: result?.status ?? "Pending",
      remarks: result?.remarks || "No remarks available",
      createdAt: result?.createdAt,
    }));

    res.status(200).json(formattedResults);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Get results of a specific student OR all if "all" is passed
export const getResultsByStudentId = async (req, res) => {
  try {
    if (req.params.studentId === "all") {
      const results = await Result.find().populate("studentId jobId");
      return res.status(200).json(results);
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.studentId)) {
      return res.status(400).json({ message: "Invalid Student ID format" });
    }

    const results = await Result.find({ studentId: req.params.studentId }).populate("jobId");

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Update a result's status and remarks
export const updateResult = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Result ID format" });
    }

    const updatedResult = await Result.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, remarks: req.body.remarks },
      { new: true }
    );

    if (!updatedResult) return res.status(404).json({ message: "Result not found" });

    res.status(200).json({ message: "Result updated successfully", result: updatedResult });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Delete a result
export const deleteResult = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Result ID format" });
    }

    await Result.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Result deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
