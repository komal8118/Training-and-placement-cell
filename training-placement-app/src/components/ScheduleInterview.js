
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./ScheduleInterview.module.css"; // CSS module

const ScheduleInterview = () => {
  const [scheduledInterviews, setScheduledInterviews] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [interviewDetails, setInterviewDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const predefinedSlots = [
    "9AM - 10AM",
    "10AM - 11AM",
    "11AM - 12PM",
    "1PM - 2PM",
    "2PM - 3PM",
    "3PM - 4PM",
    "4PM - 5PM",
  ];

  useEffect(() => {
    fetchScheduledInterviews();
  }, []);

  const fetchScheduledInterviews = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/interviews");
      setScheduledInterviews(response.data);
    } catch (error) {
      setError("Failed to load scheduled interviews.");
    }
  };

  // Schedule a New Interview
  const scheduleInterview = async () => {
    if (!selectedSlot || !selectedCandidate || !companyName || !interviewDetails) {
      setError("Please fill in all fields before scheduling.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    // Extract start time and end time from the slot (e.g., "10AM - 11AM")
    const [startTime, endTime] = selectedSlot.split(" - ");
    const todayDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    try {
      const response = await axios.post("http://localhost:4000/api/interviews", {
        studentId: selectedCandidate,
        slotId: selectedSlot,
        companyName,
        interviewDetails,
        date: todayDate,
        startTime,
        endTime,
      });

      setSuccessMessage(response.data.message);
      setSelectedSlot("");
      setSelectedCandidate("");
      setCompanyName("");
      setInterviewDetails("");

      fetchScheduledInterviews();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to schedule interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.scheduleInterview}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Schedule Interview</h2>

        {error && <p className={styles.error}>{error}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}

        {/* Dropdown to Select Predefined Slot */}
        <select
          value={selectedSlot}
          onChange={(e) => setSelectedSlot(e.target.value)}
          className={styles.selectField}
        >
          <option value="">Select a Time Slot</option>
          {predefinedSlots.map((slot, index) => (
            <option key={index} value={slot}>{slot}</option>
          ))}
        </select>

        {/* Input Fields */}
        <input
          type="text"
          placeholder="Enter Candidate ID"
          value={selectedCandidate}
          onChange={(e) => setSelectedCandidate(e.target.value)}
          className={styles.inputField}
        />
        <input
          type="text"
          placeholder="Enter Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className={styles.inputField}
        />
        <input
          type="text"
          placeholder="Interview Details"
          value={interviewDetails}
          onChange={(e) => setInterviewDetails(e.target.value)}
          className={styles.inputField}
        />

        {/* Button to Schedule Interview */}
        <button
          onClick={scheduleInterview}
          className={styles.button}
          disabled={loading}
        >
          {loading ? "Scheduling..." : "Schedule Interview"}
        </button>

        {/* Display Scheduled Interviews */}
        <h3 className={styles.heading}>Scheduled Interviews</h3>
        <ul>
          {scheduledInterviews.map((interview) => (
            <li key={interview._id}>
              {`${interview.companyName} | ${interview.startTime} - ${interview.endTime} on ${interview.date}`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ScheduleInterview;
