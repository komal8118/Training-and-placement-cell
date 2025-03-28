


import bcrypt from 'bcrypt';
import mongoose from "mongoose";
import Student from "../models/student.js";
import JobApplication from "../models/JobApplication.js";
import Job from "../models/Job.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

//----------------------------------------------------------------------------------------------------------------
// **Student Registration**
export const register = async (req, res) => {
    try {
        const { name, email, password, dob, div, year } = req.body;

        if (!name || !email || !password || !dob || !div || !year) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ success: false, message: "Student already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newStudent = new Student({
            name, email, password: hashedPassword, dob, div, year
        });
        await newStudent.save();

        res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering student:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

//----------------------------------------------------------------------------------------------------------------
// **Student Login**
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please fill all the details" });
        }

        let student = await Student.findOne({ email });
        if (!student) {
            return res.status(401).json({ success: false, message: "Student is not registered" });
        }

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(403).json({ success: false, message: "Incorrect password" });
        }

        const payload = { email: student.email, id: student._id, role: student.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });

        student = student.toObject();
        student.token = token;
        student.password = undefined;

        res.cookie("token", token, { expires: new Date(Date.now() + 7200000), httpOnly: true })
            .status(200)
            .json({ success: true, token, student, message: "User logged in successfully" });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

//----------------------------------------------------------------------------------------------------------------
// **Fetch All Job Applications**
export const getAllJobApplications = async (req, res) => {
    try {
        const jobApplications = await JobApplication.find().populate("student job");
        res.status(200).json({ success: true, jobApplications });
    } catch (error) {
        console.error("Error fetching job applications:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

//----------------------------------------------------------------------------------------------------------------
// **Apply for a Job**
export const applyToJobApplication = async (req, res) => {
    try {
        const { studentId, jobId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({ success: false, message: "Invalid studentId or jobId" });
        }

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        const existingApplication = await JobApplication.findOne({ student: studentId, job: jobId });
        if (existingApplication) {
            return res.status(400).json({ success: false, message: "Student already applied to this job" });
        }

        const application = new JobApplication({ student: studentId, job: jobId, status: "Applied" });
        await application.save();

        res.status(200).json({ success: true, message: "Application successful", applicationDetails: application });
    } catch (error) {
        console.error("Error applying for job:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

//----------------------------------------------------------------------------------------------------------------
// **Update Student Details**
export const updateStudentDetails = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { name, email, dob, div, year } = req.body;

        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ success: false, message: "Invalid student ID" });
        }

        const updatedStudent = await Student.findByIdAndUpdate(
            studentId, { name, email, dob, div, year }, { new: true, runValidators: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        res.status(200).json({ success: true, message: "Student details updated successfully", student: updatedStudent });
    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

//----------------------------------------------------------------------------------------------------------------
// **Get Available Slots**
export const getAvailableSlots = async (req, res) => {
    try {
        const availableSlots = [
            { date: "2025-03-11", time: "10:00 AM" },
            { date: "2025-03-11", time: "11:30 AM" },
            { date: "2025-03-12", time: "2:00 PM" },
            { date: "2025-03-12", time: "4:00 PM" }
        ];

        res.status(200).json({ success: true, slots: availableSlots });
    } catch (error) {
        console.error("Error fetching available slots:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
