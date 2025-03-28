
import React, { useEffect, useState } from "react";
import styles from "./EventsPage.module.css";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  // Fetch events from the backend
  useEffect(() => {
    fetch("http://localhost:4000/api/events")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  // Handle event creation
  const handleCreateEvent = () => {
    if (!eventName || !eventDate || !eventDescription) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    const newEvent = {
      name: eventName,
      date: eventDate,
      description: eventDescription,
    };

    fetch("http://localhost:4000/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    })
      .then((response) => response.json())
      .then((data) => {
        setEvents([...events, data]);
        setEventName("");
        setEventDate("");
        setEventDescription("");
      })
      .catch((error) => console.error("Error adding event:", error));
  };

  // Handle event deletion
  const handleDelete = (eventId) => {
    fetch(`http://localhost:4000/api/events/${eventId}`, {
      method: "DELETE",
    })
      .then(() => setEvents(events.filter((event) => event._id !== eventId)))
      .catch((error) => console.error("Error deleting event:", error));
  };

  return (
    <div className={styles.eventsPageContainer}>
      <div className={styles.eventsPage}>
        <h2 className={styles.heading}>Event Creation</h2>
        <div className={styles.form}>
          <input
            type="text"
            placeholder="Event Name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className={styles.input}
          />
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className={styles.input}
          />
          <textarea
            placeholder="Event Description"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            className={styles.textarea}
          ></textarea>
          <button onClick={handleCreateEvent} className={styles.button}>Create Event</button>
        </div>

        <h3 className={styles.heading}>Existing Events</h3>
        <ul className={styles.eventList}>
          {events.map((event, index) => (
            <li key={event._id || index} className={styles.eventItem}>
              <strong className={styles.eventName}>{event.name}</strong> (
              {event.date ? new Date(event.date).toLocaleDateString() : "Invalid Date"}) - {event.description}
              <button onClick={() => handleDelete(event._id)} className={styles.deleteButton}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EventsPage;
