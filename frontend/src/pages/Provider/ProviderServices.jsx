import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import "../Provider/css/ProviderServices.css";

const emptyDraft = () => ({
  category: "",
  description: "",
  hourlyRate: "",
  yearsOfExperience: "",
});

const ProviderServices = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [editingIndex, setEditingIndex] = useState(null); // null = not editing, "new" = adding
  const [draft, setDraft] = useState(emptyDraft());
  const [draftError, setDraftError] = useState("");

  const token = localStorage.getItem("token");

  // Load profile services + categories on mount
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
        setServices(data.profile?.services || data.services || []);
      } catch (err) {
        console.error("Failed to load services:", err);
        setError("Unable to load your services.");
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/categories/", {
          method: "GET",
        });
        const data = await response.json();
        setCategories(data.categories);
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchProfile();
    fetchCategories();
  }, []);

  // Converts services (which may have populated category objects) into
  // plain IDs before sending to the backend
  const toPayload = (list) =>
    list.map((s) => ({
      category: typeof s.category === "object" ? s.category._id : s.category,
      description: s.description,
      hourlyRate: Number(s.hourlyRate),
      yearsOfExperience: Number(s.yearsOfExperience),
      isActive: s.isActive !== undefined ? s.isActive : true,
    }));

  const persistServices = async (updatedList) => {
    setSaving(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:5000/api/provider/profile/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ services: toPayload(updatedList) }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update services.");
        return false;
      }

      setServices(data.profile.services);
      return true;
    } catch (err) {
      console.error("Update error:", err);
      setError("Unable to connect to server.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (index) => {
    const service = services[index];
    setDraft({
      category: typeof service.category === "object" ? service.category._id : service.category,
      description: service.description,
      hourlyRate: service.hourlyRate,
      yearsOfExperience: service.yearsOfExperience,
      isActive: service.isActive,
    });
    setEditingIndex(index);
    setDraftError("");
  };

  const startAdd = () => {
    setDraft(emptyDraft());
    setEditingIndex("new");
    setDraftError("");
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setDraft(emptyDraft());
    setDraftError("");
  };

  const handleDraftChange = (field, value) => {
    setDraft({ ...draft, [field]: value });
  };

  const validateDraft = () => {
    if (!draft.category) return "Please select a category.";
    if (!draft.description.trim()) return "Please describe your expertise.";
    if (!draft.hourlyRate) return "Please enter an hourly rate.";
    if (!draft.yearsOfExperience) return "Please enter years of experience.";

    // Prevent duplicate category (excluding the one currently being edited)
    const isDuplicate = services.some((s, i) => {
      const catId = typeof s.category === "object" ? s.category._id : s.category;
      return catId === draft.category && i !== editingIndex;
    });
    if (isDuplicate) return "You already have a service in this category.";

    return "";
  };

  const saveDraft = async () => {
    const validationError = validateDraft();
    if (validationError) {
      setDraftError(validationError);
      return;
    }

    let updatedList;
    if (editingIndex === "new") {
      updatedList = [...services, draft];
    } else {
      updatedList = services.map((s, i) => (i === editingIndex ? { ...s, ...draft } : s));
    }

    const success = await persistServices(updatedList);
    if (success) cancelEdit();
  };

  const deleteService = async (index) => {
    if (services.length === 1) {
      setError("You must have at least one service.");
      return;
    }
    const updatedList = services.filter((_, i) => i !== index);
    await persistServices(updatedList);
  };

  const toggleActive = async (index) => {
    const updatedList = services.map((s, i) =>
      i === index ? { ...s, isActive: !s.isActive } : s
    );
    await persistServices(updatedList);
  };

  const getCategoryName = (category) => {
    if (typeof category === "object" && category !== null) return category.name;
    const match = categories.find((c) => c._id === category);
    return match ? match.name : "Unknown category";
  };

  if (loading) {
    return <p className="services-loading">Loading your services...</p>;
  }

  return (
    <div className="services-page">
      <div className="services-header">
        <h1 className="services-heading">Your Services</h1>
        {editingIndex === null && (
          <button className="add-service-header-btn" onClick={startAdd} disabled={saving}>
            <Plus size={16} /> Add Service
          </button>
        )}
      </div>

      {error && <p className="field-error services-error">{error}</p>}

      {/* Existing service cards */}
      <div className="services-list">
        {services.map((service, index) =>
          editingIndex === index ? (
            <ServiceForm
              key={service._id || index}
              draft={draft}
              categories={categories}
              categoriesLoading={categoriesLoading}
              error={draftError}
              saving={saving}
              onChange={handleDraftChange}
              onSave={saveDraft}
              onCancel={cancelEdit}
            />
          ) : (
            <div className={`service-card ${!service.isActive ? "inactive" : ""}`} key={service._id || index}>
              <div className="service-card-top">
                <span className="service-category-name">{getCategoryName(service.category)}</span>
                <span className={`service-status ${service.isActive ? "active" : "paused"}`}>
                  {service.isActive ? "Active" : "Paused"}
                </span>
              </div>

              <p className="service-description">{service.description}</p>

              <div className="service-meta">
                <span>PKR {service.hourlyRate}/hr</span>
                <span>•</span>
                <span>{service.yearsOfExperience} yrs experience</span>
              </div>

              <div className="service-card-actions">
                <button className="service-action-btn" onClick={() => toggleActive(index)} disabled={saving}>
                  {service.isActive ? "Pause" : "Activate"}
                </button>
                <button className="service-action-btn" onClick={() => startEdit(index)} disabled={saving}>
                  <Pencil size={14} /> Edit
                </button>
                <button
                  className="service-action-btn danger"
                  onClick={() => deleteService(index)}
                  disabled={saving}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          )
        )}

        {editingIndex === "new" && (
          <ServiceForm
            draft={draft}
            categories={categories}
            categoriesLoading={categoriesLoading}
            error={draftError}
            saving={saving}
            onChange={handleDraftChange}
            onSave={saveDraft}
            onCancel={cancelEdit}
          />
        )}
      </div>

      <button
        className="request-category-btn"
        onClick={() => alert("Category request feature coming soon.")}
      >
        Don't see your service? Request a new category
      </button>
    </div>
  );
};

// Inline form used for both adding and editing a service
const ServiceForm = ({ draft, categories, categoriesLoading, error, saving, onChange, onSave, onCancel }) => (
  <div className="service-card editing">
    {error && <p className="field-error">{error}</p>}

    <div className="form-group">
      <label>Category</label>
      <select
        value={draft.category}
        onChange={(e) => onChange("category", e.target.value)}
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
        value={draft.description}
        onChange={(e) => onChange("description", e.target.value)}
        placeholder="e.g. Residential wiring and fan repair"
      />
    </div>

    <div className="service-entry-row">
      <div className="form-group">
        <label>Hourly Rate (PKR)</label>
        <input
          type="number"
          min="0"
          value={draft.hourlyRate}
          onChange={(e) => onChange("hourlyRate", e.target.value)}
          placeholder="e.g. 500"
        />
      </div>
      <div className="form-group">
        <label>Years of Experience</label>
        <input
          type="number"
          min="0"
          value={draft.yearsOfExperience}
          onChange={(e) => onChange("yearsOfExperience", e.target.value)}
          placeholder="e.g. 5"
        />
      </div>
    </div>

    <div className="service-form-actions">
      <button className="service-action-btn" onClick={onCancel} disabled={saving}>
        <X size={14} /> Cancel
      </button>
      <button className="service-action-btn primary" onClick={onSave} disabled={saving}>
        <Check size={14} /> {saving ? "Saving..." : "Save"}
      </button>
    </div>
  </div>
);

export default ProviderServices;