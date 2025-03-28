import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AdminFeedback.module.css"; // Import CSS module

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/feedback");
      setFeedbacks(response.data);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`http://localhost:4000/api/feedback/${id}`, { status });
      fetchFeedbacks();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Feedback & Issue Reports</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Type</th>
            <th>Message</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((feedback) => (
            <tr key={feedback._id}>
              <td>{feedback.name}</td>
              <td>{feedback.email}</td>
              <td>{feedback.type}</td>
              <td>{feedback.message}</td>
              <td>{feedback.status}</td>
              <td>
                {feedback.status === "Open" && (
                  <button onClick={() => handleStatusChange(feedback._id, "Resolved")}>
                    Mark as Resolved
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminFeedback;
