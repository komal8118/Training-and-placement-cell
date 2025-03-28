import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => setIsOpen(!isOpen);
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className={styles.navbar}>
      <h1 className={styles.logo}>T&P CELL</h1>

      {/* Mobile Menu Button */}
      <div className={styles.menuIcon} onClick={toggleNavbar}>
        {isOpen ? "❌" : "☰"}
      </div>

      {/* Overlay for Mobile Menu */}
      {isOpen && <div className={styles.overlay} onClick={toggleNavbar}></div>}

      {/* Navbar Links */}
      <ul className={`${styles.navLinks} ${isOpen ? styles.open : ""}`}>
        <li><Link to="/" onClick={toggleNavbar}>Home</Link></li>

        {user ? (
          <>
            {user.role === "student" && (
              <>
                <li><Link to="/profile" onClick={toggleNavbar}>Student Profile</Link></li>
                <li><Link to="/notifications" onClick={toggleNavbar}>Notifications</Link></li>
                <li><Link to="/jobTracking" onClick={toggleNavbar}>Job Tracking</Link></li>
                <li><Link to="/jobSearch" onClick={toggleNavbar}>Job Search</Link></li>
                <li><Link to="/result" onClick={toggleNavbar}>Result</Link></li>
                <li><Link to="/feedback" onClick={toggleNavbar}>Feedback</Link></li>
              </>
            )}
            
            {user.role === "company" && (
              <>
                <li><Link to="/company-dashboard" onClick={toggleNavbar}>Company</Link></li>
                
               
                <li><Link to="/schedule-interview" onClick={toggleNavbar}>Schedule Interview</Link></li>
              </>
            )}
            
            {user.role === "admin" && (
              <>
                <li><Link to="/events" onClick={toggleNavbar}>Events</Link></li>
                <li><Link to="/admin-dashboard" onClick={toggleNavbar}>Admin</Link></li>
                
                <li><Link to="/addResult" onClick={toggleNavbar}>Add Result</Link></li>
                <li><Link to="/adminfeedback" onClick={toggleNavbar}>FeedBack</Link></li>
                <li><Link to="/reports" onClick={toggleNavbar}>Report</Link></li>
              </>
            )}

            <li>
              <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
            </li>
          </>
        ) : (
          <li><Link to="/register" onClick={toggleNavbar}>Signup/Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
