
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  requirement: { type: String, required: true },
  qualification: { type: String, required: true },
  ctc: { type: String, required: true },
  roleDescription: { type: String, required: true },
  agreement: { type: String, required: true }, 
  status: { type: String, default: "Applied" },
  appliedDate: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
  active: { type: Boolean, default: true }
});

const Job = mongoose.model("Job", jobSchema);
export default Job;
