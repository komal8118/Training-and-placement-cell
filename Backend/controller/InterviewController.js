import Interview from "../models/Interview.js";

// ✅ Fetch all interviews
export const getAllInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find();
    res.status(200).json(interviews);
  } catch (error) {
    console.error("Error fetching interviews:", error);
    res.status(500).json({ message: "Failed to fetch interviews." });
  }
};

// ✅ Schedule a new interview
export const scheduleInterview = async (req, res) => {
  const { studentId, slotId, companyName, interviewDetails, date, startTime, endTime } = req.body;

  try {
    const newInterview = new Interview({
      studentId,
      slotId,
      companyName,
      interviewDetails,
      date,
      startTime,
      endTime,
    });

    await newInterview.save();
    res.status(201).json({ message: "Interview scheduled successfully!" });
  } catch (error) {
    console.error("Error scheduling interview:", error);
    res.status(500).json({ message: "Failed to schedule interview." });
  }
};

// ✅ Get a single interview by ID
export const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }
    res.status(200).json(interview);
  } catch (error) {
    console.error("Error fetching interview:", error);
    res.status(500).json({ message: "Failed to fetch interview." });
  }
};

// ✅ Update an interview
export const updateInterview = async (req, res) => {
  try {
    const updatedInterview = await Interview.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedInterview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    res.status(200).json({ message: "Interview updated successfully", updatedInterview });
  } catch (error) {
    console.error("Error updating interview:", error);
    res.status(500).json({ message: "Failed to update interview." });
  }
};

// ✅ Delete an interview
export const deleteInterview = async (req, res) => {
  try {
    const deletedInterview = await Interview.findByIdAndDelete(req.params.id);

    if (!deletedInterview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    res.status(200).json({ message: "Interview deleted successfully" });
  } catch (error) {
    console.error("Error deleting interview:", error);
    res.status(500).json({ message: "Failed to delete interview." });
  }
};
