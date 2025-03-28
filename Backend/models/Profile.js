import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  linkedin: String,
  college: String,
  qualification: String,
  stream: String,
  cgpa: String,
  backlog: String,
  skills: String,
  resume: String,
  gender: String,
  school10: String,
  school12: String,
  school10Percentage: String,
  school12Percentage: String,
  country: String,
  state: String,
  city: String,
  image: String
});

export default mongoose.model("Profile", profileSchema);
