import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import "./ProviderSetPage.css";

const TOTAL_STEPS = 4;

const emptyService = () => ({
  category: "",
  description: "",
  hourlyRate: "",
  yearsOfExperience: "",
});

const ProviderProfileSetup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/categories/", {
          method: "GET",
        });
        const data = await response.json();
        setCategories(data.categories);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const [formData, setFormData] = useState({
    businessName: "",
    bio: "",
    certificate: null,
    portfolioPhoto: null,
    serviceArea: "",
    travelDistance: "",
  });

  // Services is managed as its own array of objects, separate from formData
  const [services, setServices] = useState([emptyService()]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleServiceChange = (index, field, value) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  const addService = () => {
    setServices([...services, emptyService()]);
  };

  const removeService = (index) => {
    if (services.length === 1) return; // at least one service required
    setServices(services.filter((_, i) => i !== index));
  };

  const validateStep = () => {
    if (step === 1 && !formData.businessName.trim()) {
      return "Business/profile name is required.";
    }

    if (step === 2) {
      for (const service of services) {
        if (!service.category) {
          return "Please select a category for each service.";
        }
        if (!service.description.trim()) {
          return "Please describe your expertise for each service.";
        }
        if (!service.hourlyRate) {
          return "Please enter an hourly rate for each service.";
        }
        if (!service.yearsOfExperience) {
          return "Please enter years of experience for each service.";
        }
      }

      // Prevent selecting the same category twice
      const selectedCategories = services.map((s) => s.category);
      const hasDuplicates = new Set(selectedCategories).size !== selectedCategories.length;
      if (hasDuplicates) {
        return "You've selected the same category more than once.";
      }
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
      payload.append("businessName", formData.businessName);
      payload.append("bio", formData.bio);
      payload.append("serviceArea", formData.serviceArea);
      payload.append("travelDistance", formData.travelDistance);

      if (formData.certificate) payload.append("certificate", formData.certificate);
      if (formData.portfolioPhoto) payload.append("portfolioPhoto", formData.portfolioPhoto);

      // Services array must be sent as a JSON string inside FormData
      payload.append("services", JSON.stringify(services));

      const response = await fetch("http://127.0.0.1:5000/api/provider/profile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

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
            <div key={s} className={`setup-progress-dot ${s <= step ? "active" : ""}`} />
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

        {/* Step 2: Services (multiple) */}
        {step === 2 && (
          <div className="setup-step">
            <h2 className="setup-heading">Your services</h2>
            <p className="setup-subtext">
              Add each service you offer, with its own rate and experience.
            </p>

            {services.map((service, index) => (
              <div className="service-entry" key={index}>
                <div className="service-entry-header">
                  <span className="service-entry-title">Service {index + 1}</span>
                  {services.length > 1 && (
                    <button
                      type="button"
                      className="service-remove-btn"
                      onClick={() => removeService(index)}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={service.category}
                    onChange={(e) => handleServiceChange(index, "category", e.target.value)}
                    disabled={categoriesLoading}
                  >
                    <option value="" disabled>
                      {categoriesLoading ? "Loading categories..." : "Select a category"}
                    </option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Describe your expertise</label>
                  <textarea
                    rows={2}
                    value={service.description}
                    onChange={(e) => handleServiceChange(index, "description", e.target.value)}
                    placeholder="e.g. Residential wiring and fan repair"
                  />
                </div>

                <div className="service-entry-row">
                  <div className="form-group">
                    <label>Hourly Rate (PKR)</label>
                    <input
                      type="number"
                      min="0"
                      value={service.hourlyRate}
                      onChange={(e) => handleServiceChange(index, "hourlyRate", e.target.value)}
                      placeholder="e.g. 500"
                    />
                  </div>
                  <div className="form-group">
                    <label>Years of Experience</label>
                    <input
                      type="number"
                      min="0"
                      value={service.yearsOfExperience}
                      onChange={(e) => handleServiceChange(index, "yearsOfExperience", e.target.value)}
                      placeholder="e.g. 5"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button type="button" className="add-service-btn" onClick={addService}>
              <Plus size={16} /> Add another service
            </button>
          </div>
        )}

        {/* Step 3: Documents */}
        {step === 3 && (
          <div className="setup-step">
            <h2 className="setup-heading">Documents</h2>
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
            <button type="button" className="setup-back-btn" onClick={handleBack} disabled={loading}>
              Back
            </button>
          )}

          {step < TOTAL_STEPS ? (
            <button type="button" className="signup-submit-btn" onClick={handleNext}>
              Next
            </button>
          ) : (
            <button type="button" className="signup-submit-btn" onClick={handleFinish} disabled={loading}>
              {loading ? "Saving..." : "Finish"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderProfileSetup;