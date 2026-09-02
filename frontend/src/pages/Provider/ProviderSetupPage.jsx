import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProviderSetPage.css";

const TOTAL_STEPS = 4;

const ProviderProfileSetup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Profile
    businessName: "",
    bio: "",

    // Step 2: Services
    category: "",
    expertiseDescription: "",

    // Step 3: Experience
    yearsOfExperience: "",
    hourlyRate: "",
    certificate: null,
    portfolioPhoto: null,

    // Step 4: Service Area
    serviceArea: "",
    travelDistance: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const validateStep = () => {
    if (step === 1 && !formData.businessName.trim()) {
      return "Business/profile name is required.";
    }
    if (step === 2 && (!formData.category || !formData.expertiseDescription.trim())) {
      return "Please select a category and describe your expertise.";
    }
    if (step === 3 && (!formData.yearsOfExperience || !formData.hourlyRate)) {
      return "Experience and hourly rate are required.";
    }
    if (step === 4 && (!formData.serviceArea.trim() || !formData.travelDistance)) {
      return "Service area and travel distance are required.";
    }
    return "";
  };

  const handleNext = () => {
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setStep(step + 1);
  };

  const handleBack = () => {
    setError("");
    setStep(step - 1);
  };

  const handleFinish = async () => {
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) payload.append(key, value);
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/provider/profile`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Note: no Content-Type here — browser sets it automatically for FormData
          },
          body: payload,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to save profile. Try again.");
        setLoading(false);
        return;
      }

      navigate("/provider/home");

    } catch (err) {
      console.error("Profile setup error:", err);
      setError("Unable to connect to server. Check your connection.");
      setLoading(false);
    }
  };

  return (
    <div className="setup-page">
      <div className="setup-container">
        <div className="setup-progress">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`setup-progress-dot ${s <= step ? "active" : ""}`}
            />
          ))}
        </div>
        <p className="setup-step-label">Step {step} of {TOTAL_STEPS}</p>

        {error && <p className="field-error setup-error">{error}</p>}

        {/* Step 1: Profile */}
        {step === 1 && (
          <div className="setup-step">
            <h2 className="setup-heading">Set up your profile</h2>
            <div className="form-group">
              <label htmlFor="businessName">Business / Display Name</label>
              <input
                id="businessName"
                name="businessName"
                type="text"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="e.g. Ali Electric Works"
              />
            </div>
            <div className="form-group">
              <label htmlFor="bio">Short Bio</label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell customers a bit about yourself"
              />
            </div>
          </div>
        )}

        {/* Step 2: Services */}
        {step === 2 && (
          <div className="setup-step">
            <h2 className="setup-heading">Your services</h2>
            <div className="form-group">
              <label htmlFor="category">Service Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="" disabled>Select a category</option>
                <option value="electrician">Electrician</option>
                <option value="plumber">Plumber</option>
                <option value="ac_technician">AC Technician</option>
                <option value="appliance_repair">Appliance Repair</option>
                <option value="carpenter">Carpenter</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="expertiseDescription">Describe your expertise</label>
              <textarea
                id="expertiseDescription"
                name="expertiseDescription"
                rows={3}
                value={formData.expertiseDescription}
                onChange={handleChange}
                placeholder="e.g. 8 years fixing residential wiring and AC installations"
              />
            </div>
          </div>
        )}

        {/* Step 3: Experience */}
        {step === 3 && (
          <div className="setup-step">
            <h2 className="setup-heading">Experience & pricing</h2>
            <div className="form-group">
              <label htmlFor="yearsOfExperience">Years of Experience</label>
              <input
                id="yearsOfExperience"
                name="yearsOfExperience"
                type="number"
                min="0"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                placeholder="e.g. 5"
              />
            </div>
            <div className="form-group">
              <label htmlFor="hourlyRate">Hourly Charge (PKR)</label>
              <input
                id="hourlyRate"
                name="hourlyRate"
                type="number"
                min="0"
                value={formData.hourlyRate}
                onChange={handleChange}
                placeholder="e.g. 500"
              />
            </div>
            <div className="form-group">
              <label htmlFor="certificate">Certificate / Training (optional)</label>
              <input
                id="certificate"
                name="certificate"
                type="file"
                accept="image/*,.pdf"
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="portfolioPhoto">Portfolio Photo (optional)</label>
              <input
                id="portfolioPhoto"
                name="portfolioPhoto"
                type="file"
                accept="image/*"
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        {/* Step 4: Service Area */}
        {step === 4 && (
          <div className="setup-step">
            <h2 className="setup-heading">Service area</h2>
            <div className="form-group">
              <label htmlFor="serviceArea">Service Area / City</label>
              <input
                id="serviceArea"
                name="serviceArea"
                type="text"
                value={formData.serviceArea}
                onChange={handleChange}
                placeholder="e.g. Lahore - Gulberg, Johar Town"
              />
            </div>
            <div className="form-group">
              <label htmlFor="travelDistance">Max Travel Distance (km)</label>
              <input
                id="travelDistance"
                name="travelDistance"
                type="number"
                min="0"
                value={formData.travelDistance}
                onChange={handleChange}
                placeholder="e.g. 10"
              />
            </div>
          </div>
        )}

        <div className="setup-nav-buttons">
          {step > 1 && (
            <button
              type="button"
              className="setup-back-btn"
              onClick={handleBack}
              disabled={loading}
            >
              Back
            </button>
          )}

          {step < TOTAL_STEPS ? (
            <button
              type="button"
              className="signup-submit-btn"
              onClick={handleNext}
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              className="signup-submit-btn"
              onClick={handleFinish}
              disabled={loading}
            >
              {loading ? "Saving..." : "Finish"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderProfileSetup;