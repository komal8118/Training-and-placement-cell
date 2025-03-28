

import express from "express";
import {
    register,
    login,
    getAllJobApplications,
    applyToJobApplication,
    updateStudentDetails,
    getAvailableSlots
} from "../controller/studentController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/applications", getAllJobApplications);
router.post("/apply/:studentId/:jobId", applyToJobApplication);
router.put("/update/:studentId", updateStudentDetails);
router.get("/slots", getAvailableSlots);

export default router;
