
import React, { createContext, useContext, useState } from "react";
import { useNotifications } from "./NotificationsContext";

const EventsContext = createContext();

export const EventsProvider = ({ children }) => {
  const { addNotification } = useNotifications(); // Ensure this is called after NotificationsProvider
  const [events, setEvents] = useState([]);

  const addEvent = (event) => {
    setEvents((prev) => [...prev, event]);
    addNotification(`New event created: ${event.name}`);
  };

  const removeEvent = (eventId) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId));
    addNotification("Event deleted.");
  };

  return (
    <EventsContext.Provider value={{ events, addEvent, removeEvent }}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => {
  return useContext(EventsContext);
};
