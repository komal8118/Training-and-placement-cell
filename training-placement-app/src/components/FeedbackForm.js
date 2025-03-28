import React, { useState } from "react";
import axios from "axios";
import styles from "./FeedbackForm.module.css"; // Import CSS module

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "Feedback",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/feedback", formData);
      alert("Feedback submitted successfully!");
      setFormData({ name: "", email: "", type: "Feedback", message: "" });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Error submitting feedback");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Submit Feedback / Report an Issue</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <select name="type" value={formData.type} onChange={handleChange} className={styles.input}>
          <option value="Feedback">Feedback</option>
          <option value="Issue">Issue</option>
        </select>
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
          className={styles.textarea}
        />
        <button type="submit" className={styles.button}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
