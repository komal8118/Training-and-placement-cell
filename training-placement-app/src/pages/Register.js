

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "./Register.module.css";

const API_BASE_URL = "http://localhost:4000/api/auth"; // Ensure backend is running on this URL

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeForm, setActiveForm] = useState("login");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student", // Default role
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (activeForm === "signup") {
        if (formData.password !== formData.confirmPassword) {
          setLoading(false);
          return setError("Passwords do not match!");
        }

        const response = await axios.post(`${API_BASE_URL}/register`, {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });

        alert(response.data.message);
        setActiveForm("login"); // Switch to login after signup
      } else {
        const response = await axios.post(`${API_BASE_URL}/login`, {
          email: formData.email,
          password: formData.password,
        });

        console.log("Login response:", response.data); // Debugging

        const { username, role, token } = response.data;
        login({ username, role, token });

        alert(`Welcome ${username} (${role})!`);

        // ✅ Redirect to home page after login
        navigate("/");
      }
    } catch (error) {
      console.error("Error response:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.authContainer}>
        <form className={styles.authForm} onSubmit={handleFormSubmit}>
          {activeForm === "signup" && (
            <>
              <label className={styles.label}>Username</label>
              <input
                className={styles.input}
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />

              <label className={styles.label}>Role</label>
              <select
                className={styles.input}
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="student">Student</option>
                <option value="company">Company</option>
                <option value="admin">Admin</option>
              </select>
            </>
          )}

          <label className={styles.label}>Email</label>
          <input
            className={styles.input}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label className={styles.label}>Password</label>
          <input
            className={styles.input}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {activeForm === "signup" && (
            <>
              <label className={styles.label}>Confirm Password</label>
              <input
                className={styles.input}
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </>
          )}

          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? "Processing..." : activeForm === "login" ? "Login" : "Signup"}
          </button>
        </form>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.switchForm}>
          {activeForm === "signup" ? (
            <p>
              Already have an account?{" "}
              <span className={styles.link} onClick={() => setActiveForm("login")}>
                Login
              </span>
            </p>
          ) : (
            <p>
              Don't have an account?{" "}
              <span className={styles.link} onClick={() => setActiveForm("signup")}>
                Sign Up
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
