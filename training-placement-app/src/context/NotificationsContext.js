
import React, { createContext, useContext, useState } from "react";

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    { jobTitle: "Software Engineer", status: "Applied" },
    { jobTitle: "Frontend Developer", status: "Shortlisted" },
  ]);

  const sendNotification = (message) => {
    setNotifications((prev) => [...prev, message]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationsContext.Provider value={{ notifications, sendNotification, clearNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);
