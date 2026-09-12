import { useState, useEffect } from "react";
import { User, MapPin, Lock, Save } from "lucide-react";
import "././css/profile.css";

const CustomerProfile = () => {
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

 
  const [profileData, setProfileData] = useState({ name: "", email: "", phone: "" });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");


  const [addressData, setAddressData] = useState({ label: "", fullAddress: "", city: "", area: "" });
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressSuccess, setAddressSuccess] = useState("");


  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/customer/profile/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        setProfileData({
          name: data.user?.name || "",
          email: data.user?.email || "",
          phone: data.user?.phone || "",
        });

        setAddressData({
          label: data.addresses?.label || "",
          fullAddress: data.addresses?.fullAddress || "",
          city: data.addresses?.city || "",
          area: data.addresses?.area || "",
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Unable to load your profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);


  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
    setProfileSuccess("");
  };

  const handleProfileSave = async () => {
    setProfileSaving(true);
    setProfileSuccess("");
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:5000/api/customer/profile/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: profileData.name, email: profileData.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update profile.");
        return;
      }

      setProfileSuccess("Profile updated successfully.");
    } catch (err) {
      console.error("Update error:", err);
      setError("Unable to connect to server.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleAddressChange = (e) => {
    setAddressData({ ...addressData, [e.target.name]: e.target.value });
    setAddressSuccess("");
  };

  const handleAddressSave = async () => {
    if (!addressData.fullAddress.trim() || !addressData.city.trim()) {
      setError("Full address and city are required.");
      return;
    }

    setAddressSaving(true);
    setAddressSuccess("");
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:5000/api/customer/profile/me/addresses", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to save address.");
        return;
      }

      setAddressSuccess("Address saved successfully.");
    } catch (err) {
      console.error("Address save error:", err);
      setError("Unable to connect to server.");
    } finally {
      setAddressSaving(false);
    }
  };


  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setPasswordError("");
    setPasswordSuccess("");
  };

  const handlePasswordSave = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setPasswordError("Please fill in both password fields.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setPasswordSaving(true);
    setPasswordError("");
    setPasswordSuccess("");

    try {
      const response = await fetch("http://127.0.0.1:5000/api/customer/profile/me/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPasswordError(data.message || "Failed to change password.");
        return;
      }

      setPasswordSuccess("Password changed successfully.");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error("Password change error:", err);
      setPasswordError("Unable to connect to server.");
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) {
    return <p className="profile-loading">Loading your profile...</p>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1 className="profile-heading">Profile</h1>
        <p className="profile-subtext">Manage your personal details and account settings</p>
      </div>

      {error && <p className="field-error profile-page-error">{error}</p>}

      {/* Personal Details */}
      <section className="profile-section">
        <div className="profile-section-title">
          <User size={18} />
          <h2>Personal Details</h2>
        </div>

        <div className="profile-form-row">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleProfileChange}
              placeholder="Your full name"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleProfileChange}
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input type="text" value={profileData.phone} disabled />
          <span className="field-hint">Phone number cannot be changed</span>
        </div>

        {profileSuccess && <p className="field-success">{profileSuccess}</p>}

        <button className="profile-save-btn" onClick={handleProfileSave} disabled={profileSaving}>
          <Save size={15} /> {profileSaving ? "Saving..." : "Save Changes"}
        </button>
      </section>

      {/* Address */}
      <section className="profile-section">
        <div className="profile-section-title">
          <MapPin size={18} />
          <h2>Address</h2>
        </div>

        <div className="profile-form-row">
          <div className="form-group">
            <label>Label</label>
            <input
              type="text"
              name="label"
              value={addressData.label}
              onChange={handleAddressChange}
              placeholder="e.g. Home, Office"
            />
          </div>
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={addressData.city}
              onChange={handleAddressChange}
              placeholder="e.g. Lahore"
            />
          </div>
        </div>

        <div className="profile-form-row">
          <div className="form-group">
            <label>Area</label>
            <input
              type="text"
              name="area"
              value={addressData.area}
              onChange={handleAddressChange}
              placeholder="e.g. Gulberg"
            />
          </div>
          <div className="form-group">
            <label>Full Address</label>
            <input
              type="text"
              name="fullAddress"
              value={addressData.fullAddress}
              onChange={handleAddressChange}
              placeholder="House #, street, landmark"
            />
          </div>
        </div>

        {addressSuccess && <p className="field-success">{addressSuccess}</p>}

        <button className="profile-save-btn" onClick={handleAddressSave} disabled={addressSaving}>
          <Save size={15} /> {addressSaving ? "Saving..." : "Save Address"}
        </button>
      </section>

      {/* Change Password */}
      <section className="profile-section">
        <div className="profile-section-title">
          <Lock size={18} />
          <h2>Change Password</h2>
        </div>

        {passwordError && <p className="field-error">{passwordError}</p>}
        {passwordSuccess && <p className="field-success">{passwordSuccess}</p>}

        <div className="form-group">
          <label>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            placeholder="Enter current password"
          />
        </div>

        <div className="profile-form-row">
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="At least 6 characters"
            />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Re-enter new password"
            />
          </div>
        </div>

        <button className="profile-save-btn" onClick={handlePasswordSave} disabled={passwordSaving}>
          <Save size={15} /> {passwordSaving ? "Saving..." : "Change Password"}
        </button>
      </section>
    </div>
  );
};

export default CustomerProfile;