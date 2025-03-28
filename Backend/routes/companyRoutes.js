import express from "express";
import * as companyController from "../controller/companyController.js"; // Fixed import

const router = express.Router();

// ✅ Company Routes
router.post("/companyLogin", companyController.login);
router.post("/create-job", companyController.createJobApplication);
router.get("/job-application", companyController.getAllJobApplications);
router.get("/job-applicants/:jobId", companyController.getApplicantsForJobApplication);
router.put("/job-application/:jobId/process/:studentId", companyController.processApplication);
router.put("/job-application/:jobId", companyController.updateJobApplication);
router.delete("/job-delete-application/:jobId", companyController.deleteJobApplication);

export default router;
