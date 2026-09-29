import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  MapPin,
  BadgeCheck,
  CheckCircle,
  Circle,
  Wallet,
  Clock,
} from "lucide-react";
import "./css/CustomerProviderProfile.css";

const CustomerProviderProfile = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
useEffect(() => {
  const fetchProfile = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/customerhome/providerprofile/${providerId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to load this provider.");
        return;
      }

      setProfile(data.profile);
    } catch (err) {
      console.error("Failed to load provider profile:", err);
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, [providerId]);
  if (loading) {
  return <p className="profile-view-loading">Loading provider profile...</p>;
}

if (error || !profile) {
  return <p className="profile-view-loading">{error || "Provider not found."}</p>;
}

return (
  <div className="provider-view-page">
    <button className="back-link-btn" onClick={() => navigate(-1)}>
      <ArrowLeft size={16} /> Back
    </button>

    {/* Header */}
    <div className="provider-view-header">
      <div className="provider-view-avatar">
        {profile.businessName?.charAt(0).toUpperCase()}
      </div>

      <div>
        <div className="provider-view-name-row">
          <h1 className="provider-view-name">{profile.businessName}</h1>
          {profile.verificationStatus === "verified" && (
            <BadgeCheck size={20} color="#2b7fff" />
          )}
        </div>

        <div className="provider-view-status-row">
          <span className={`online-dot ${profile.isOnline ? "online" : "offline"}`} />
          {profile.isOnline ? "Online now" : "Offline"}
        </div>

        <span className="provider-view-area">
          <MapPin size={14} /> {profile.serviceArea}
        </span>
      </div>
    </div>

    {/* Stats row */}
    <div className="provider-view-stats">
      <div className="view-stat-card">
  <div className="view-star-row">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={16}
        fill={i < Math.round(profile.rating?.average || 0) ? "#eae617" : "none"}
        color={i < Math.round(profile.rating?.average || 0) ? "#eae617" : "#E4E7EA"}
      />
    ))}
  </div>
  <span className="view-stat-value">
    {profile.rating?.average > 0
      ? `${profile.rating.average} (${profile.rating.count} reviews)`
      : "No reviews yet"}
  </span>
  <span className="view-stat-label">Rating</span>
</div>

      <div className="view-stat-card">
        <CheckCircle size={18} color="#2b7fff" />
        <span className="view-stat-value">{profile.completedJobsCount}</span>
        <span className="view-stat-label">Completed Jobs</span>
      </div>

      <div className="view-stat-card">
        <MapPin size={18} color="#2b7fff" />
        <span className="view-stat-value">{profile.travelDistance} km</span>
        <span className="view-stat-label">Travel Distance</span>
      </div>
    </div>

    {/* Bio */}
    {profile.bio && (
      <section className="provider-view-section">
        <h2 className="view-section-title">About</h2>
        <p className="provider-view-bio">{profile.bio}</p>
      </section>
    )}

    {/* Services */}
    <section className="provider-view-section">
      <h2 className="view-section-title">Services Offered</h2>
      <div className="view-services-list">
        {profile.services?.map((service) => (
          <div className="view-service-card" key={service._id}>
            <div className="view-service-top">
              <span className="view-service-category">{service.category?.name}</span>
              <span className="view-service-price">
                <Wallet size={13} /> PKR {service.hourlyRate}/hr
              </span>
            </div>
            <p className="view-service-description">{service.description}</p>
            <span className="view-service-experience">
              <Clock size={13} /> {service.yearsOfExperience} yrs experience
            </span>
            {!service.isActive && (
              <span className="view-service-paused">Currently paused</span>
            )}
          </div>
        ))}
      </div>
    </section>
  </div>
);
};

export default CustomerProviderProfile;