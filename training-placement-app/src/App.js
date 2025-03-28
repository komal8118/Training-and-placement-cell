

import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import io from "socket.io-client";
import toast from "react-hot-toast"; // ✅ For real-time notifications

// ✅ Import Core Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";

// ✅ Import Pages
import Home from "./pages/Home";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import JobSearch from "./pages/JobSearch";
import JobTracking from "./pages/JobTracking";
import Reports from "./pages/Reports";
import EventsPage from "./pages/EventsPage";
import NotificationsPage from "./pages/NotificationsPage";
import CompanyPage from "./pages/CompanyPage";
import AdminPage from "./pages/AdminPage";

// ✅ Import Components

import ScheduleInterview from "./components/ScheduleInterview";

// ✅ Import Context Providers
import { EventsProvider } from "./context/EventsProvider";
import { NotificationsProvider } from "./context/NotificationsContext";
import { JobProvider } from "./context/JobContext";
import AuthProvider, { AuthContext } from "./context/AuthContext";

import "./App.css";
import Result from "./pages/Result";
import AddResult from "./pages/AddResult";
import Feedback from "./components/FeedbackForm";
import AdminFeedback from "./components/AdminFeedback";

// ✅ WebSocket connection (dynamic URL with fallback)
const SOCKET_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";
const socket = io(SOCKET_URL, { autoConnect: false }); // ✅ Prevent auto-connection

// ✅ Protected Route Component for Role-based Access
const ProtectedRoute = ({ element, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!user || !allowedRoles.includes(user?.role)) return <Navigate to="/" replace />;

  return element;
};

function App() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // ✅ Connect to WebSocket when the component mounts
    socket.connect();

    const handleNotification = (message) => {
      setNotifications((prev) => [...prev, message]);
      toast.info(message, { position: "top-right", duration: 4000 });
    };

    socket.on("jobUpdate", (data) => {
      toast.success(`New job update: ${data.title} at ${data.company}`, { duration: 5000 });
    });

    socket.on("notification", handleNotification);

    return () => {
      socket.off("jobUpdate");
      socket.off("notification", handleNotification);
      socket.disconnect(); // ✅ Cleanup WebSocket on unmount
    };
  }, []);

  return (
    <AuthProvider>
      <ErrorBoundary>
        <NotificationsProvider>
          <EventsProvider>
            <JobProvider>
              <Router>
                <Navbar />

                <Routes>
                  {/* ✅ Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/register" element={<Register />} />

                  {/* ✅ Student Routes */}
                  <Route path="/profile" element={<ProtectedRoute element={<Profile />} allowedRoles={["student"]} />} />
                  <Route path="/jobSearch" element={<ProtectedRoute element={<JobSearch />} allowedRoles={["student"]} />} />
                  <Route path="/jobTracking" element={<ProtectedRoute element={<JobTracking />} allowedRoles={["student"]} />} />
                  <Route path="/notifications" element={<ProtectedRoute element={<NotificationsPage />} allowedRoles={["student"]} />} />
                  <Route path="/result" element={<ProtectedRoute element={<Result />} allowedRoles={["student"]} />} />
                  <Route path="/reports" element={<ProtectedRoute element={<Reports />} allowedRoles={["admin"]} />} />
                  <Route path="/feedback" element={<ProtectedRoute element={<Feedback />} allowedRoles={["student"]} />} />
                  {/* ✅ Company Routes */}
                  <Route path="/company-dashboard" element={<ProtectedRoute element={<CompanyPage />} allowedRoles={["company"]} />} />
                  
                  <Route path="/schedule-interview" element={<ProtectedRoute element={<ScheduleInterview />} allowedRoles={["company"]} />} />

                  {/* ✅ Admin Routes */}
                  <Route path="/admin-dashboard" element={<ProtectedRoute element={<AdminPage />} allowedRoles={["admin"]} />} />
                  <Route path="/events" element={<ProtectedRoute element={<EventsPage />} allowedRoles={["admin"]} />} />
                  <Route path="/addResult" element={<ProtectedRoute element={<AddResult />} allowedRoles={["admin"]} />} />
                  <Route path="/adminfeedback" element={<ProtectedRoute element={<AdminFeedback />} allowedRoles={["admin"]} />} />
                </Routes>

                <Footer />
              </Router>
            </JobProvider>
          </EventsProvider>
        </NotificationsProvider>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
