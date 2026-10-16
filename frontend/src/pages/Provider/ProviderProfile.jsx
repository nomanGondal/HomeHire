// src/pages/Provider/ProviderProfile.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  BadgeCheck,
  Clock,
  CheckCircle,
  Navigation,
  Pencil,
  Save,
  X,
} from "lucide-react";
import "./css/Providerprofile.css";

const verificationConfig = {
  pending: { label: "Verification Pending", className: "pending" },
  verified: { label: "Verified Provider", className: "verified" },
  rejected: { label: "Verification Rejected", className: "rejected" },
};

const ProviderProfile = () => {
  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({
    businessName: "",
    bio: "",
    serviceArea: "",
    travelDistance: "",
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/provider/profile/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Unable to load your profile.");
          return;
        }

        setProfile(data.profile);
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Unable to connect to server.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const startEdit = () => {
    setDraft({
      businessName: profile.businessName || "",
      bio: profile.bio || "",
      serviceArea: profile.serviceArea || "",
      travelDistance: profile.travelDistance ?? "",
    });
    setSaveError("");
    setSaveSuccess("");
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setSaveError("");
  };

  const handleDraftChange = (e) => {
    setDraft({ ...draft, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!draft.businessName.trim() || !draft.serviceArea.trim() || draft.travelDistance === "") {
      setSaveError("Business name, service area and travel distance are required.");
      return;
    }

    setSaving(true);
    setSaveError("");

    try {
      const response = await fetch("http://127.0.0.1:5000/api/provider/profile/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          businessName: draft.businessName,
          bio: draft.bio,
          serviceArea: draft.serviceArea,
          travelDistance: Number(draft.travelDistance),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSaveError(data.message || "Failed to update profile.");
        return;
      }

      // Merge so populated fields (user, services.category) are not lost
      setProfile((prev) => ({
        ...prev,
        businessName: data.profile.businessName,
        bio: data.profile.bio,
        serviceArea: data.profile.serviceArea,
        travelDistance: data.profile.travelDistance,
      }));

      setIsEditing(false);
      setSaveSuccess("Profile updated successfully.");
    } catch (err) {
      console.error("Update error:", err);
      setSaveError("Unable to connect to server.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="pprofile-loading">Loading your profile...</p>;
  }

  if (error || !profile) {
    return <p className="pprofile-loading">{error || "Profile not found."}</p>;
  }

  const verification =
    verificationConfig[profile.verificationStatus] || verificationConfig.pending;
  const roundedRating = Math.round(profile.rating?.average || 0);

  return (
    <div className="pprofile-page">
      {/* Header card */}
      <div className="pprofile-header">
        <div className="pprofile-avatar">
          {profile.businessName?.charAt(0).toUpperCase()}
        </div>

        <div className="pprofile-header-info">
          <div className="pprofile-name-row">
            <h1 className="pprofile-name">{profile.businessName}</h1>
            {profile.verificationStatus === "verified" && (
              <BadgeCheck size={20} color="#2b7fff" />
            )}
          </div>

          <span className={`pprofile-verification ${verification.className}`}>
            {verification.label}
          </span>

          <div className="pprofile-stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={16}
                fill={i < roundedRating ? "#eae617" : "none"}
                color={i < roundedRating ? "#eae617" : "#E4E7EA"}
              />
            ))}
            <span className="pprofile-rating-text">
              {profile.rating?.count > 0
                ? `${profile.rating.average} (${profile.rating.count} reviews)`
                : "No reviews yet"}
            </span>
          </div>
        </div>

        {!isEditing && (
          <button className="pprofile-edit-btn" onClick={startEdit}>
            <Pencil size={14} /> Edit Profile
          </button>
        )}
      </div>

      {saveSuccess && <p className="pprofile-success">{saveSuccess}</p>}

      {/* Stats */}
      <div className="pprofile-stats">
        <div className="pprofile-stat">
          <CheckCircle size={18} color="#2b7fff" />
          <span className="pprofile-stat-value">{profile.completedJobsCount}</span>
          <span className="pprofile-stat-label">Completed Jobs</span>
        </div>
        <div className="pprofile-stat">
          <Navigation size={18} color="#2b7fff" />
          <span className="pprofile-stat-value">{profile.travelDistance} km</span>
          <span className="pprofile-stat-label">Travel Distance</span>
        </div>
        <div className="pprofile-stat">
          <Clock size={18} color="#2b7fff" />
          <span className="pprofile-stat-value">
            {new Date(profile.createdAt).toLocaleDateString()}
          </span>
          <span className="pprofile-stat-label">Member Since</span>
        </div>
      </div>

      {/* Business details — view or edit */}
      <section className="pprofile-section">
        <h2 className="pprofile-section-title">Business Details</h2>

        {isEditing ? (
          <>
            {saveError && <p className="field-error">{saveError}</p>}

            <div className="pprofile-form-group">
              <label>Business Name</label>
              <input
                type="text"
                name="businessName"
                value={draft.businessName}
                onChange={handleDraftChange}
              />
            </div>

            <div className="pprofile-form-group">
              <label>Bio</label>
              <textarea
                name="bio"
                rows={3}
                value={draft.bio}
                onChange={handleDraftChange}
                placeholder="Tell customers a bit about yourself"
              />
            </div>

            <div className="pprofile-form-row">
              <div className="pprofile-form-group">
                <label>Service Area</label>
                <input
                  type="text"
                  name="serviceArea"
                  value={draft.serviceArea}
                  onChange={handleDraftChange}
                />
              </div>
              <div className="pprofile-form-group">
                <label>Max Travel Distance (km)</label>
                <input
                  type="number"
                  min="0"
                  name="travelDistance"
                  value={draft.travelDistance}
                  onChange={handleDraftChange}
                />
              </div>
            </div>

            <div className="pprofile-form-actions">
              <button className="pprofile-btn" onClick={cancelEdit} disabled={saving}>
                <X size={14} /> Cancel
              </button>
              <button className="pprofile-btn primary" onClick={handleSave} disabled={saving}>
                <Save size={14} /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="pprofile-bio">{profile.bio || "No bio added yet."}</p>
            <span className="pprofile-area">
              <MapPin size={14} /> {profile.serviceArea}
            </span>
          </>
        )}
      </section>

      {/* Contact (read-only, comes from the user account) */}
      <section className="pprofile-section">
        <h2 className="pprofile-section-title">Contact</h2>
        <div className="pprofile-contact">
          <span><Phone size={14} /> {profile.user?.phone}</span>
          <span><Mail size={14} /> {profile.user?.email}</span>
        </div>
      </section>

      {/* Services summary (managed from the Services page) */}
      <section className="pprofile-section">
        <div className="pprofile-section-header">
          <h2 className="pprofile-section-title">Services</h2>
          <Link to="/provider/services" className="pprofile-link">Manage services</Link>
        </div>

        <div className="pprofile-services">
          {profile.services?.map((service) => (
            <div
              className={`pprofile-service ${!service.isActive ? "paused" : ""}`}
              key={service._id}
            >
              <div className="pprofile-service-top">
                <span className="pprofile-service-name">{service.category?.name}</span>
                <span className="pprofile-service-rate">PKR {service.hourlyRate}/hr</span>
              </div>
              <p className="pprofile-service-desc">{service.description}</p>
              <span className="pprofile-service-meta">
                {service.yearsOfExperience} yrs experience
                {!service.isActive && " • Paused"}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProviderProfile;