import React, { useState, useEffect } from 'react';
import "../component/Calander.css";

const Calendar = () => {
  const [events, setEvents] = useState(() => {
    return JSON.parse(localStorage.getItem('events')) || [];
  });
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');

  // Save events to localStorage when they change
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  // Add event to the calendar
  const addEvent = () => {
    if (!eventTitle || !eventDate || !eventTime) {
      alert("Please fill all fields.");
      return;
    }
    const newEvent = { title: eventTitle, date: eventDate, time: eventTime };
    setEvents([...events, newEvent]);
    setEventTitle('');
    setEventDate('');
    setEventTime('');
  };

  // Check if an event is approaching
  useEffect(() => {
    const checkEvents = () => {
      const currentTime = new Date();
      events.forEach((event) => {
        const eventTime = new Date(`${event.date}T${event.time}`);
        if (Math.abs(currentTime - eventTime) < 60000) {
          alert(`Event: ${event.title} is happening now!`);
        }
      });
    };

    const interval = setInterval(checkEvents, 60000);
    return () => clearInterval(interval);
  }, [events]);

  return (
    <div>
      <h2>Calendar of Events</h2>
      <input
        type="text"
        placeholder="Event Title"
        value={eventTitle}
        onChange={(e) => setEventTitle(e.target.value)}
      />
      <input
        type="date"
        value={eventDate}
        onChange={(e) => setEventDate(e.target.value)}
      />
      <input
        type="time"
        value={eventTime}
        onChange={(e) => setEventTime(e.target.value)}
      />
      <button onClick={addEvent}>Add Event</button>

      <h3>Upcoming Events</h3>
      <ul>
        {events.map((event, index) => (
          <li key={index}>
            {event.title} on {event.date} at {event.time}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Calendar;
