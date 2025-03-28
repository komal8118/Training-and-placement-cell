import React from "react";
import styles from "./Home.module.css"; // Import CSS Module

const Home = () => {
  return (
    <div className={styles.homeBanner}>
      {/* Background Video */}
      <video autoPlay loop muted playsInline className={styles.video} aria-label="Background video">
        <source src="/videos/hello.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Home Content */}
      <div className={styles.homeContent}>
        <h2>Welcome to the Training and Placement Cell</h2>
        <p>Your gateway to career opportunities and professional growth.</p>
      </div>

      {/* About Section */}
      <div className={styles.aboutSection}>
        <h3>About Our Training and Placement Cell</h3>
        <p>
          The Training and Placement Cell aims to bridge the gap between students and their dream careers.
          We provide skill development programs, resume-building workshops, mock interviews, and direct
          placement opportunities with top recruiters.
        </p>
        <p>
          Our mission is to ensure that every student gets the right career guidance and industry exposure
          to secure the best possible placement.
        </p>
      </div>

      {/* Placement Analytics Section */}
      <div className={styles.analyticsSection}>
        <h3>Placement Analytics</h3>
        <div className={styles.analyticsImages}>
          <img src="/images/a1.jpg" alt="Placement statistics graph" loading="lazy" />
          <img src="/images/a2.jpg" alt="Student placement success rate" loading="lazy" />
          <img src="/images/a3.jpg" alt="Yearly placement trends" loading="lazy" />
          <img src="/images/a4.jpg" alt="Company hiring statistics" loading="lazy" />
        </div>
        <p>Our placement statistics reflect our dedication to student success.</p>
      </div>

      {/* Recruiters Section */}
      <div className={styles.recruiterSection}>
        <h3>Our Recruiters</h3>
        <div className={styles.recruiterImages}>
          <img src="/images/Recruiters.jpg" alt="List of recruiters hiring students" loading="lazy" />
        </div>
      </div>
    </div>
  );
};

export default Home;
