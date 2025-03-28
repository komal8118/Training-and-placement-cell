
import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  status: { type: String, required: true },
  remarks: { type: String },
  ctc: { type: Number, required: true }, // ✅ Ensure CTC field exists
});

export default mongoose.model("Result", resultSchema);
