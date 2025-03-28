
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import io from "socket.io-client";
import styles from "./JobSearch.module.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";
const socket = io(BACKEND_URL);

function JobSearch() {
  const [searchQuery, setSearchQuery] = useState({
    company: "",
    location: "",
  });
  const [jobs, setJobs] = useState([]);  // Stores filtered jobs
  const [allJobs, setAllJobs] = useState([]); // Stores all jobs initially
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJobs();

    socket.on("newJob", (newJob) => {
      setJobs((prevJobs) => [newJob, ...prevJobs]);
      setAllJobs((prevJobs) => [newJob, ...prevJobs]); // Update all jobs
      toast.success(`🚀 New Job Posted: ${newJob.title} at ${newJob.company}`);
    });

    return () => {
      socket.off("newJob");
    };
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${BACKEND_URL}/api/jobs`);
      setJobs(response.data);
      setAllJobs(response.data); // Save the full list for filtering
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const filteredJobs = allJobs.filter((job) => {
      const jobCompany = job?.company?.toLowerCase() || "";
      const jobLocation = job?.location?.toLowerCase() || "";

      return (
        jobCompany.includes(searchQuery.company.toLowerCase()) &&
        jobLocation.includes(searchQuery.location.toLowerCase())
      );
    });

    setJobs(filteredJobs);
  };

  return (
    <div className={styles.jobContainer}>
    <div className={styles.jobSearchContainer}>
      <div className={styles.heroSection}>
        <h1 className={styles.title}>Find your dream job</h1>
      </div>

      {/* ✅ Search Bar */}
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Company Name"
          className={styles.inputField}
          value={searchQuery.company}
          onChange={(e) => setSearchQuery({ ...searchQuery, company: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          className={styles.inputField}
          value={searchQuery.location}
          onChange={(e) => setSearchQuery({ ...searchQuery, location: e.target.value })}
        />
        <button className={styles.searchButton} onClick={handleSearch}>
          Search
        </button>
      </div>

      {loading && <p>Loading jobs...</p>}
      {error && <p className={styles.error}>Error: {error}</p>}

      <div className={styles.jobList}>
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job._id} className={styles.jobCard}>
              <h3 className={styles.jobTitle}>{job.title}</h3>
              <p><strong>Company:</strong> {job.company}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Description:</strong> {job.description}</p>
            </div>
          ))
        ) : (
          !loading && <p>No jobs found</p>
        )}
      </div>
    </div>
    </div>
  );
}

export default JobSearch;
