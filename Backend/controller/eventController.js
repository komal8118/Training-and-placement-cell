
import Event from "../models/eventModel.js";
import Notification from "../models/Notification.js"; // Import notification model
import { notifyClients } from "../index.js"; // Import WebSocket function

// Create Event & Notification
export const createEvent = async (req, res) => {
  try {
    const { name, date, description } = req.body;

    if (!name || !date || !description) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create event
    const newEvent = await Event.create({ name, date, description });

    // ✅ Create a notification for the new event
    const newNotification = await Notification.create({
      message: `New Event: ${name} on ${date}`,
      read: false,
    });

    // ✅ Notify connected clients in real-time
    notifyClients({ message: `New Event: ${name} on ${date}` });

    res.status(201).json({ success: true, event: newEvent, notification: newNotification });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }); // Sort by upcoming events
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete Event & Remove Notification
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    await Event.findByIdAndDelete(id);
    await Notification.deleteOne({ message: `New Event: ${event.name} on ${event.date}` }); // Remove related notification

    res.status(200).json({ message: "Event deleted successfully." });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
