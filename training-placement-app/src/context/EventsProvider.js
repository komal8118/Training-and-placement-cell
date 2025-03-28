import React, { createContext, useContext, useState } from "react";
import { useNotifications } from "./NotificationsContext";

const EventsContext = createContext();

export const EventsProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const { addNotification } = useNotifications();

  const addEvent = (event) => {
    setEvents((prevEvents) => [...prevEvents, event]);
    addNotification(`New event created: ${event.name}`);
  };

  const removeEvent = (eventId) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
    addNotification("Event deleted.");
  };

  return (
    <EventsContext.Provider value={{ events, addEvent, removeEvent }}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventsProvider");
  }
  return context;
};
