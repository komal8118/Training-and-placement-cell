

import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./NotificationsPage.module.css";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get("http://localhost:4000/api/notifications");
                setNotifications(response.data || []); 
            } catch (error) {
                console.error("Error fetching notifications:", error);
                setNotifications([]);
            }
        };
        fetchNotifications();
    }, []);

    useEffect(() => {
        fetch("http://localhost:4000/api/events")
            .then((response) => response.json())
            .then((data) => setEvents(data))
            .catch((error) => console.error("Error fetching events:", error));
    }, []);

    
    

    

    return (
        <div className={styles.notificationPageContainer}>
            
            
            <h3 className={styles.heading}>Notification</h3>
            <ul className={styles.eventList}>
                {events.map((event, index) => (
                    <li key={event._id || index} className={styles.eventItem}>
                        <strong className={styles.eventName}>{event.name}</strong> (
                        {event.date ? new Date(event.date).toLocaleDateString() : "Invalid Date"}) - {event.description}
                       
                    </li>
                ))}
            </ul>
            
            
        </div>
    );
};

export default Notifications;
