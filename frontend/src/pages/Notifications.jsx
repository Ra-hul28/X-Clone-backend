import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications");
        setNotifications(res.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const deleteNotifications = async () => {
    try {
      await api.delete("/notifications");
      setNotifications([]);
    } catch (err) {
      alert("Failed to delete notifications");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h2>Notifications</h2>
        <button className="delete-all-btn" onClick={deleteNotifications}>
          Clear all
        </button>
      </div>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <p className="no-notifs">No notifications yet. ✨</p>
        ) : (
          notifications.map((notification) => (
            <div key={notification._id} className="notification-item">
              <div className="notif-icon">
                {notification.type === "follow" && <span className="follow-icon">👤</span>}
                {notification.type === "like" && <span className="like-icon">❤️</span>}
              </div>
              <div className="notif-content">
                <img 
                  src={notification.from.profileImg || "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"} 
                  alt="user" 
                />
                <p>
                  <b>{notification.from.username}</b> {notification.type === "follow" ? "followed you" : "liked your post"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;