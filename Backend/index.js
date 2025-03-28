
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config(); // ✅ Load environment variables

// ✅ Import Routes
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import notificationRoutes from "./routes/notificationsRoutes.js";
import jobRoutes from "./routes/jobs.js";
import applicationRoutes from "./routes/applications.js";
import eventRoutes from "./routes/eventRoutes.js";
import interviewRoutes from "./routes/InterviewRoute.js";
import resultRoutes from "./routes/resultRoutes.js";
import feedbackRoutes from "./routes/feedback.js";

// ✅ Import Models
import Feedback from "./models/Feedback.js";
import Student from "./models/student.js";
import InterviewModel from "./models/InterviewModel.js";
import Notification from "./models/Notification.js";
import Event from "./models/eventModel.js";

// ✅ Define Report Schema & Model
const reportSchema = new mongoose.Schema({
  totalStudents: Number,
  placedStudents: Number,
  unplacedStudents: Number,
  placementPercentage: Number,
  companiesVisited: Number,
});

const Report = mongoose.model("Report", reportSchema);

// ✅ Initialize Express and Server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// ✅ Middleware
app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB with better error handling
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// ✅ Register API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/feedback", feedbackRoutes);

// ✅ Reports API Route - FIXES 404 ERROR
app.get("/api/reports", async (req, res) => {
  try {
    const reports = await Report.find(); // Fetch all reports
    res.status(200).json(reports);
  } catch (error) {
    console.error("❌ Error fetching reports:", error);
    res.status(500).json({ message: "Error fetching reports", error });
  }
});
// app.delete("/api/jobs/:id", async (req, res) => {
//   try {
//     const job = await Job.findByIdAndDelete(req.params.id);
//     if (!job) {
//       return res.status(404).json({ error: "Job not found" });
//     }
//     res.json({ message: "Job deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// ✅ Events Routes
app.post("/api/events", async (req, res) => {
  try {
    const { name, date, description } = req.body;
    const newEvent = new Event({ name, date, description });
    await newEvent.save();

    const newNotification = new Notification({
      message: `New Event Created: ${name} on ${date}`,
      date: new Date(),
    });
    await newNotification.save();

    notifyClients(newNotification.message);
    res.json(newEvent);
  } catch (error) {
    res.status(500).json({ message: "Error creating event", error });
  }
});

// ✅ WebSocket Connection
io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.id);
  socket.on("disconnect", () => console.log("❌ A user disconnected"));
});

// ✅ Notify Users When a New Job is Posted
export const notifyNewJob = (job) => {
  try {
    io.emit("newJob", job);
  } catch (error) {
    console.error("WebSocket error:", error);
  }
};

// ✅ Notify Clients for New Notifications
export const notifyClients = async (message) => {
  try {
    io.emit("newNotification", { message });
  } catch (error) {
    console.error("WebSocket error:", error);
  }
};

// ✅ Root API Route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Training & Placement Cell API! 🚀" });
});

// ✅ Start the Server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
