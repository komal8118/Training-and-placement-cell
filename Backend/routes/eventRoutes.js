import express from "express";
import { createEvent, getEvents, deleteEvent } from "../controller/eventController.js";

const router = express.Router();

// Route to create an event
router.post("/", createEvent);

// Route to get all events
router.get("/", getEvents);

// Route to delete an event
router.delete("/:id", deleteEvent);

export default router;
