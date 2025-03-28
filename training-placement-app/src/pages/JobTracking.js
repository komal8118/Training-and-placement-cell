
import React, { useState, useEffect } from "react";
import styles from "./JobTracking.module.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";

const JobTracking = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:4000/api/jobs`)
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // ✅ Update job status
  const updateStatus = (id, newStatus) => {
    fetch(`http://localhost:4000/api/jobs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => res.json())
      .then((updatedJob) => {
        setJobs((prevJobs) =>
          prevJobs.map((job) => (job._id === id ? updatedJob : job))
        );
      })
      .catch((err) => console.error("Error updating status:", err));
  };

  return (
    <div className={styles.jobTrackingContainer}>
      <div className={styles.heroSection}>
        <h1 className={styles.title}>Job Tracking</h1>
      </div>

      <div className={styles.jobListContainer}>
        {loading && <p className={styles.loading}>Loading jobs...</p>}
        {error && <p className={styles.error}>Error: {error}</p>}
        {!loading && !error && jobs.length === 0 && <p className={styles.noJobs}>No jobs available.</p>}

        <div className={styles.jobList}>
          {jobs.map((job) => (
            <div key={job._id} className={styles.jobCard}>
              <h3 className={styles.jobTitle}>{job.title}</h3>
              <p className={styles.company}><strong>Company:</strong> {job.company}</p>
              <p className={styles.location}><strong>Location:</strong> {job.location}</p>
              <p className={styles.description}><strong>Description:</strong> {job.description}</p>
              <p className={styles.status}><strong>Status:</strong> {job.status || "Applied"}</p>
              
              {/* ✅ Fix Date Display */}
              <p><strong>Applied On:</strong> {job.appliedDate}</p>
              <p><strong>Last Updated:</strong> {job.lastUpdated}</p>

              {/* ✅ Status Update Buttons */}
              <button className={styles.statusBtn} onClick={() => updateStatus(job._id, "Interview Scheduled")}>Interview Scheduled</button>
              <button className={styles.statusBtn} onClick={() => updateStatus(job._id, "Rejected")}>Rejected</button>
            </div>
          ))}
        </div>
      </div>

      
    </div>
  );
};

export default JobTracking;
