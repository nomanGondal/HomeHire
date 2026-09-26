import { useState, useEffect } from "react";
import { Briefcase, MessageSquare, FileText, Star, MapPin, Clock } from "lucide-react";
import "../Provider/css/ProviderHome.css";

// Static placeholder data — will be replaced by real API calls later
const STATS = [
  { label: "Active Bookings", value: 3, icon: Briefcase },
  { label: "Pending Quotes", value: 5, icon: FileText },
  { label: "Unread Messages", value: 2, icon: MessageSquare },
  { label: "Average Rating", value: "4.8", icon: Star },
];

const JOB_REQUESTS = [
  {
    id: 1,
    category: "Electrician",
    description: "Ceiling fan not working, needs inspection and possible rewiring.",
    area: "Gulberg, Lahore",
    postedAgo: "10 min ago",
  },
  {
    id: 2,
    category: "AC Technician",
    description: "AC not cooling properly, gas refill might be needed.",
    area: "Johar Town, Lahore",
    postedAgo: "45 min ago",
  },
  {
    id: 3,
    category: "Plumber",
    description: "Kitchen sink leaking from the pipe joint.",
    area: "Model Town, Lahore",
    postedAgo: "2 hours ago",
  },
];

const RECENT_ACTIVITY = [
  { id: 1, text: "New message from Ahmed Raza", time: "5 min ago" },
  { id: 2, text: "Quote accepted for AC repair job", time: "1 hour ago" },
  { id: 3, text: "New review received — 5 stars", time: "Yesterday" },
];

const RECENT_REVIEWS = [
  {
    id: 1,
    customerName: "Ayesha Malik",
    rating: 5,
    comment: "Very professional and on time. Fixed the wiring issue quickly.",
    daysAgo: "2 days ago",
  },
  {
    id: 2,
    customerName: "Bilal Ahmed",
    rating: 4,
    comment: "Good work, but arrived a bit later than the scheduled time.",
    daysAgo: "5 days ago",
  },
  {
    id: 3,
    customerName: "Sana Tariq",
    rating: 5,
    comment: "Explained the problem clearly and charged a fair price.",
    daysAgo: "1 week ago",
  },
];

const StarRating = ({ rating }) => (
  <div className="review-stars">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={14}
        fill={i < rating ? "#deb41bce" : "none"}
        color={i < rating ? "#deb41bce" : "#E4E7EA"}
      />
    ))}
  </div>
);

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

const ProviderHome = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobRequests, setJobRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);


  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          "http://127.0.0.1:5000/api/provider/profile/me",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setProfile(data.profile || data);
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchOpenRequests = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          "http://127.0.0.1:5000/api/requests/open",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setJobRequests(data.requests || []);
      } catch (err) {
        console.error("Failed to load job requests:", err);
      } finally {
        setRequestsLoading(false);
      }
    };

    fetchProfile();
    fetchOpenRequests();
  }, []);

  if (loading) {
    return <p className="home-loading">Loading your dashboard...</p>;
  }

  return (
    <div className="provider-home">
      {/* Header */}
      <div className="home-header">
        <div>
          <h1 className="home-heading">
            Welcome, {profile?.businessName || "Provider"}
          </h1>
          <span className={`home-badge ${profile?.isVerified ? "verified" : "pending"}`}>
            {profile?.isVerified ? "✓ Verified Provider" : "Verification Pending"}
          </span>
        </div>
      </div>

      {/* Quick stats */}
      <div className="home-stats-grid">
        {STATS.map(({ label, value, icon: Icon }) => (
          <div className="stat-card" key={label}>
            <div className="stat-icon">
              <Icon size={20} />
            </div>
            <div>
              <p className="stat-value">{value}</p>
              <p className="stat-label">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Incoming job requests */}
       <section className="home-section">
        <h2 className="section-title">Incoming Job Requests</h2>

        {requestsLoading ? (
          <p className="empty-text">Loading requests...</p>
        ) : jobRequests.length === 0 ? (
          <p className="empty-text">No new job requests right now.</p>
        ) : (
          <div className="job-requests-list">
            {jobRequests.map((job) => (
              <div className="job-card" key={job._id}>
                <div className="job-card-top">
                  <span className="job-category">{job.category?.name}</span>
                  <span className="job-time">
                    <Clock size={14} /> {timeAgo(job.createdAt)}
                  </span>
                </div>

                <p className="job-description">{job.description}</p>

                <div className="job-card-bottom">
                  <span className="job-area">
                    <MapPin size={14} />
                    {job.address?.area ? `${job.address.area}, ` : ""}{job.address?.city}
                  </span>
                  <button className="job-quote-btn">Send Quote</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      {/* Recent reviews */}
      <section className="home-section">
        <h2 className="section-title">Recent Reviews</h2>
        <div className="reviews-list">
          {RECENT_REVIEWS.map((review) => (
            <div className="review-card" key={review.id}>
              <div className="review-card-top">
                <span className="review-customer">{review.customerName}</span>
                <span className="review-time">{review.daysAgo}</span>
              </div>
              <StarRating rating={review.rating} />
              <p className="review-comment">{review.comment}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent activity */}
      <section className="home-section">
        <h2 className="section-title">Recent Activity</h2>
        <div className="activity-list">
          {RECENT_ACTIVITY.map((item) => (
            <div className="activity-item" key={item.id}>
              <span className="activity-text">{item.text}</span>
              <span className="activity-time">{item.time}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProviderHome;