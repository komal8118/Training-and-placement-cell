import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";

const router = express.Router();

router.get("/user/profile", getProfile);{
    console.log("hello");
}
router.post("/update", updateProfile);

export default router;
