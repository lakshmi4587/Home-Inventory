import React, { useEffect, useState } from 'react';
import { fetchNotifications, markNotificationAsRead } from '../utils/api';
import '../styles/NotificationsPage.css'; // Import the CSS file

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const data = await fetchNotifications();
        console.log("Notifications fetched:", data); // Log fetched notifications
        setNotifications(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setLoading(false); // Stop loading even on error
      }
    };
    

    getNotifications();
  }, []);

  const token = localStorage.getItem('token');

  const handleMarkAsRead = async (id, index) => {
    try {
      const updatedNotification = await markNotificationAsRead(id, token);
  
      // Update the local state after marking as read
      const updatedNotifications = [...notifications];
      const updatedIndex = updatedNotifications.findIndex(
        (notif) => notif._id === updatedNotification._id
      );
  
      if (updatedIndex !== -1) {
        updatedNotifications[updatedIndex] = updatedNotification;
        setNotifications(updatedNotifications);
      }
  
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };
    

  return (
    <div className="notifications-container">
      <h2 className="notifications-title">Your Notifications</h2>
      {loading ? (
        <div className="loading-spinner"></div> // Show the spinner while loading
      ) : notifications.length === 0 ? (
        <p className="no-notifications">No notifications</p>
      ) : (
        <div className="notifications-box">
          <ul className="notifications-list">
            {notifications.map((notif, index) => (
              <li
                key={notif._id}
                onClick={() => handleMarkAsRead(notif._id, index)}
                className={`notification-item ${notif.read ? 'read' : 'unread'}`}
              >
                <strong className="notification-title">{notif.title || 'Notification'}</strong>
                <p className="notification-message">{notif.message}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
