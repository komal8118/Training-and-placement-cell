

import React, { useEffect, useState, useCallback } from "react";
import { useNotifications } from "../context/NotificationsContext";
import styles from "./Notifications.module.css";

const Notifications = ({ studentId }) => {
  const { notifications, sendNotification, clearNotifications } = useNotifications(); // ✅ Fixed function name
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(() => {
    const controller = new AbortController();
    const { signal } = controller;

    fetch(`/api/applications/student/${studentId}`, { signal })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch applications.");
        return res.json();
      })
      .then((data) => {
        const existingNotifications = new Set(
          notifications.map((notif) => `${notif.jobTitle}-${notif.status}`)
        );

        data.forEach((app) => {
          const notifKey = `${app.jobTitle}-${app.status}`;
          if (!existingNotifications.has(notifKey)) {
            sendNotification({ jobTitle: app.jobTitle, status: app.status }); // ✅ Fixed function name
          }
        });
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          console.log("Fetch request was canceled.");
        } else {
          console.error("Error fetching applications:", error);
          setError("Failed to load notifications. Please try again.");
        }
      });

    return controller;
  }, [studentId, sendNotification]); // ✅ Removed `notifications` dependency

  useEffect(() => {
    const controller = fetchNotifications();

    return () => controller.abort(); // ✅ Proper cleanup
  }, [fetchNotifications]);

  return (
    <div className={styles.notifications}>
      <h2>Application Status</h2>

      {error && <p className={styles.error}>{error}</p>}

      {notifications.length === 0 ? (
        <p className={styles.empty}>No notifications available.</p>
      ) : (
        <ul className={styles.notificationList}>
          {notifications.map((notif, index) => (
            <li key={`${notif.jobTitle}-${notif.status}-${index}`} className={styles.notificationItem}>
              <p className={styles.jobTitle}>Job: {notif.jobTitle}</p>
              <p className={styles.status}>Status: {notif.status}</p>
            </li>
          ))}
        </ul>
      )}

      <button className={styles.clearNotifications} onClick={clearNotifications}>
        Clear Notifications
      </button>
    </div>
  );
};

export default Notifications;
