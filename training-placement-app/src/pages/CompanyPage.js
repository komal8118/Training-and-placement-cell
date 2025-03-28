
import React, { useState, useEffect } from "react";
import styles from "./CompanyPage.module.css"; // Import CSS Module

const BACKEND_URL = "http://localhost:4000/api/jobs"; // Define backend URL

const CompanyPage = () => {
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

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(BACKEND_URL);
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

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...companyProfile, active: true }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to post job");
      }

      const newJob = await response.json();
      setJobs([...jobs, newJob]);
      alert("Job Posted Successfully!");

      setCompanyProfile({
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
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
        const response = await fetch(`${BACKEND_URL}/${jobId}`, {
            method: "DELETE",
        });

        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(responseData.error || "Failed to delete job");
        }

        setJobs(jobs.filter((job) => job._id !== jobId));
        alert("Job deleted successfully!");
    } catch (err) {
        console.error("Error deleting job:", err);
        alert(`Error: ${err.message}`);
    }
};
  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.companyPageContainer}>
      <div className={styles.companyPage}>
        <h3 className={styles.heading}>Company Profile</h3>
        <form onSubmit={handleEventSubmit} className={styles.form}>
          <label>Job Title</label>
          <input type="text" name="title" value={companyProfile.title} onChange={handleProfileChange} className={styles.input} required />
          
          <label>Company Name</label>
          <input type="text" name="company" value={companyProfile.company} onChange={handleProfileChange} className={styles.input} required />
          
          <label>Location</label>
          <input type="text" name="location" value={companyProfile.location} onChange={handleProfileChange} className={styles.input} required />
          
          <label>Job Description</label>
          <textarea name="description" value={companyProfile.description} onChange={handleProfileChange} className={styles.textarea} required />
          
          <label>Requirement</label>
          <input type="text" name="requirement" value={companyProfile.requirement} onChange={handleProfileChange} className={styles.input} required />
          
          <label>Qualification</label>
          <input type="text" name="qualification" value={companyProfile.qualification} onChange={handleProfileChange} className={styles.input} required />
          
          <label>CTC</label>
          <input type="text" name="ctc" value={companyProfile.ctc} onChange={handleProfileChange} className={styles.input} required />
          
          <label>Role Description</label>
          <textarea name="roleDescription" value={companyProfile.roleDescription} onChange={handleProfileChange} className={styles.textarea} required />
          
          <label>Agreement Details</label>
          <textarea name="agreement" value={companyProfile.agreement} onChange={handleProfileChange} className={styles.textarea} />
          
          <button type="submit" className={styles.button}>Post Job</button>
        </form>

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
                <button onClick={() => handleDeleteJob(job._id)} className={styles.deleteButton} disabled={!job.active}>
                  {job.active ? "Delete Job" : "Job Inactive"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;