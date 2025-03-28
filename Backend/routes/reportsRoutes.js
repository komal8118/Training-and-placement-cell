
import express from "express";
import {
  createResult,
  getAllResults,
  getResultsByStudentId,
  updateResult,
  deleteResult,
} from "../controller/resultController.js"; // ✅ Ensure correct case and `.js` extension

const router = express.Router();

// ✅ 1️⃣ Create a new result
router.post("/", createResult);

// ✅ 2️⃣ Get all results
router.get("/", getAllResults);

// ✅ 3️⃣ Get results of a specific student OR all if "all" is passed
router.get("/:studentId", getResultsByStudentId);

// ✅ 4️⃣ Update a result
router.put("/:id", updateResult);

// ✅ 5️⃣ Delete a result
router.delete("/:id", deleteResult);

export default router;
