
import React, { useState, useEffect } from "react";
import styles from "./AddResult.module.css"; // Import the CSS module

const AddResult = () => {
  const [students, setStudents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedJobId, setSelectedJobId] = useState("");
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [ctc, setCtc] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/students");
        if (!response.ok) throw new Error("Failed to fetch students");
        const data = await response.json();
        setStudents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching students:", error);
        setStudents([]);
      }
    };

    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/jobs");
        if (!response.ok) throw new Error("Failed to fetch jobs");
        const data = await response.json();
        setJobs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs([]);
      }
    };

    fetchStudents();
    fetchJobs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resultData = {
      studentId: selectedStudentId.trim(),
      jobId: selectedJobId.trim(),
      status: status.trim(),
      remarks: remarks.trim() || "",
      ctc: ctc ? parseFloat(ctc) : 0,
    };

    console.log("Sending data:", resultData);

    try {
      const response = await fetch("http://localhost:4000/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resultData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add result");
      }

      const result = await response.json();
      console.log("Result added successfully:", result);
      alert("Result added successfully!");

      setSelectedStudentId("");
      setSelectedJobId("");
      setStatus("");
      setRemarks("");
      setCtc("");
    } catch (error) {
      console.error("Error adding result:", error.message);
      alert("Error: " + error.message);
    }
  };

  return (
    <div>
      {/* Video Background */}
      <video autoPlay loop muted className={styles.videoBackground}>
        <source src="/videos/hello1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className={styles.container}>
        <h2>Add Result</h2>
        <form onSubmit={handleSubmit}>
          <label>Student:</label>
          <select value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)} required>
            <option value="">Select Student</option>
            {students.length > 0 ? (
              students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name}
                </option>
              ))
            ) : (
              <option disabled>No students available</option>
            )}
          </select>

          <label>Job:</label>
          <select value={selectedJobId} onChange={(e) => setSelectedJobId(e.target.value)} required>
            <option value="">Select Job</option>
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <option key={job._id} value={job._id}>
                  {job.title} - {job.company}
                </option>
              ))
            ) : (
              <option disabled>No jobs available</option>
            )}
          </select>

          <label>Status:</label>
          <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} required />

          <label>Remarks:</label>
          <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} />

          <label>CTC:</label>
          <input type="number" value={ctc} onChange={(e) => setCtc(e.target.value)} required />

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default AddResult;
