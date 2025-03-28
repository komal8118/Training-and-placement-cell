import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  name: String,
  email: String,
  type: { type: String, enum: ["Feedback", "Issue"], required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ["Open", "Resolved"], default: "Open" },
  createdAt: { type: Date, default: Date.now }
});

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;
