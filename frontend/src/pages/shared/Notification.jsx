// src/pages/shared/NotificationsPage.jsx
import { useState, useEffect } from "react";
import { Bell, CheckCircle, XCircle, Clock } from "lucide-react";
import "./Notification.css";

// Maps a notification "type" to an icon — extend this as more types are added
const typeIcons = {
  job_completion_request: CheckCircle,
};

const timeAgo = (dateString) => {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [respondingId, setRespondingId] = useState(null); // which card is mid-request

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("http://127.0.0.1:5000/api/notifications/my", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        // Only show notifications that are unread AND still awaiting a response
        const visible = (data.notifications || []).filter(
          (n) => !n.isRead && n.status === "pending"
        );

        setNotifications(visible);
      } catch (err) {
        console.error("Failed to load notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleRespond = async (notificationId, newStatus) => {
    setRespondingId(notificationId);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/notifications/${notificationId}/respond`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to respond:", data.message);
        return;
      }

      // Once responded, it no longer belongs in this "pending" list — remove it
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
    } catch (err) {
      console.error("Respond error:", err);
    } finally {
      setRespondingId(null);
    }
  };

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h1 className="notifications-heading">Notifications</h1>
        <p className="notifications-subtext">Updates and requests that need your attention</p>
      </div>

      {loading ? (
        <p className="notifications-empty">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <div className="notifications-empty">
          <Bell size={32} color="#9AA5AB" />
          <p>You're all caught up — no notifications.</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification) => {
            const Icon = typeIcons[notification.type] || Bell;
            const isResponding = respondingId === notification._id;

            return (
              <div className="notification-card unread" key={notification._id}>
                <div className="notification-icon">
                  <Icon size={18} />
                </div>

                <div className="notification-body">
                  <div className="notification-top">
                    <span className="notification-title">{notification.title}</span>
                    <span className="notification-time">
                      <Clock size={12} /> {timeAgo(notification.createdAt)}
                    </span>
                  </div>

                  <p className="notification-message">{notification.message}</p>

                  {notification.sender?.name && (
                    <p className="notification-description">
                      Service Provider: {notification.sender.name}
                    </p>
                  )}

                  {notification.booking?.serviceRequest?.description && (
                    <p className="notification-description">
                      Description: {notification.booking.serviceRequest.description}
                    </p>
                  )}

                  <div className="notification-actions">
                    <button
                      className="notif-action-btn accept"
                      onClick={() => handleRespond(notification._id, "accepted")}
                      disabled={isResponding}
                    >
                      <CheckCircle size={14} />
                      {isResponding ? "Sending..." : "Accept"}
                    </button>
                    <button
                      className="notif-action-btn reject"
                      onClick={() => handleRespond(notification._id, "rejected")}
                      disabled={isResponding}
                    >
                      <XCircle size={14} />
                      {isResponding ? "Sending..." : "Reject"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notification;