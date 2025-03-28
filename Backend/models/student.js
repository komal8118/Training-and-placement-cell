

import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: String,
  password:String,
  email: String,
  dob: Date,
  div: String,
  year: Number,
  placementStatus: { type: String, enum: ["Placed", "Unplaced"], default: "Unplaced" },
  package: { type: Number, default: 0 }, // Salary package in LPA
});

const Student = mongoose.model("Student", studentSchema);
export default Student;
