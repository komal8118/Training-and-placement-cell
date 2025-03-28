
import React, { useEffect, useState } from "react";
import styles from "./AdminPage.module.css";

const AdminPage = () => {
  const [companyProfile, setCompanyProfile] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    requirement: "",
    qualification: "",
    ctc: "",
    roleDescription: "",
    agreement: "",
  });

  const [interviews, setInterviews] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/interviews");
        if (!response.ok) throw new Error("Failed to fetch interviews");
        const data = await response.json();
        setInterviews(data);
      } catch (error) {
        console.error("Error fetching interviews:", error);
      }
    };

    fetchInterviews();
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/jobs");
        if (!response.ok) throw new Error("Failed to fetch jobs");
        const data = await response.json();
        setJobs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setCompanyProfile({ ...companyProfile, [name]: value });
  };

  const handleDeleteInterview = async (interviewId) => {
    if (window.confirm("Are you sure you want to delete this interview?")) {
      try {
        const response = await fetch(`http://localhost:4000/api/interviews/${interviewId}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete interview");

        setInterviews((prevInterviews) => prevInterviews.filter((interview) => interview._id !== interviewId));
      } catch (error) {
        console.error("Error deleting interview:", error);
      }
    }
  };

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.adminPageContainer}>
      <div className={styles.adminContainer}>
        <h3>Posted Jobs</h3>
        <div>
          {jobs.length === 0 ? (
            <p>No jobs posted yet.</p>
          ) : (
            jobs.map((job) => (
              <div key={job._id} className={styles.jobCard}>
                <h5>{job.title} at {job.company}</h5>
                <p>Location: {job.location}</p>
                <p>Requirement: {job.requirement}</p>
                <p>Qualification: {job.qualification}</p>
                <p>CTC: {job.ctc}</p>
                <p>Role: {job.roleDescription}</p>
                <p className={job.active ? styles.active : styles.inactive}>
                  {job.active ? "✅ Active" : "❌ No Longer Accepting"}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Scheduled Interviews Section */}
        <h3>Scheduled Interviews</h3>
        {interviews.length === 0 ? (
          <p>No interviews scheduled.</p>
        ) : (
          <table className={styles.jobTable}>
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Student ID</th>
                <th>Date</th>
                <th>Time</th>
                <th>Details</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((interview) => (
                <tr key={interview._id}>
                  <td>{interview.companyName}</td>
                  <td>{interview.studentId}</td>
                  <td>{new Date(interview.date).toLocaleDateString()}</td>
                  <td>{interview.startTime} - {interview.endTime}</td>
                  <td>{interview.interviewDetails}</td>
                  <td>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteInterview(interview._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
