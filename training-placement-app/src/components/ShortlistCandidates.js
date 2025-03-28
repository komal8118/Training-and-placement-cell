import React, { useState } from "react";
import axios from "axios";
import styles from "./ShortlistCandidates.module.css"; // Import the CSS module

const ShortlistCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [minCGPA, setMinCGPA] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchShortlistedCandidates = async () => {
    if (!minCGPA && !skills.trim()) {
      setError("Please enter at least one filter (CGPA or Skills).");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:4000/api/shortlist-candidates", {
        minCGPA: minCGPA || null, // Send null if CGPA is not provided
        skills: skills
          ? skills.split(",").map(skill => skill.trim().toLowerCase()) // Normalize input
          : [],
      });
      setCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setError("Failed to fetch candidates. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.shortlistCandidate}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Shortlist Candidates</h2>

        {error && <p className={styles.error}>{error}</p>} {/* Display error message */}

        <div className={styles.filters}>
          <input
            type="number"
            placeholder="Min CGPA"
            value={minCGPA}
            onChange={(e) => setMinCGPA(e.target.value)}
            className={styles.inputField}
            min="0"
            max="10"
          />
          <input
            type="text"
            placeholder="Skills (comma separated)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className={styles.inputField}
          />
          <button
            onClick={fetchShortlistedCandidates}
            className={styles.button}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {loading ? (
          <p>Loading candidates...</p>
        ) : (
          <ul className={styles.candidateList}>
            {candidates.length > 0 ? (
              candidates.map((candidate) => (
                <li key={candidate.id} className={styles.candidateItem}>
                  {candidate.name} - CGPA: {candidate.cgpa} - Skills: {candidate.skills.join(", ")}
                </li>
              ))
            ) : (
              <p>No candidates found.</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ShortlistCandidates;
