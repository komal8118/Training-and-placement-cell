
import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  slotId: { type: String, required: true },
  companyName: { type: String, required: true },
  interviewDetails: { type: String, required: true },
  date: { type: Date, required: true }, // Ensure proper Date type
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
});

const Interview = mongoose.model("Interview", interviewSchema);
export default Interview;
