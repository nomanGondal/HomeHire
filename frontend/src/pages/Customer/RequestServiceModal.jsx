import { useState } from "react";
import "./css/Openrequest.css"
const RequestServiceModal = ({ provider, preSelectedCategory, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        category:preSelectedCategory?._id || "",
        description: "",
        urgency: "",
        preferredDateTime: "",
        fullAddress: "",
        city: "",
        area: "",
        photo: null,
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({ ...formData, [name]: files ? files[0] : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.category || !formData.description.trim() || !formData.fullAddress.trim() || !formData.city.trim()) {
            setError("Please fill in the required fields.");
            return;
        }

        setError("");
        setLoading(true);

        const token = localStorage.getItem("token");

        try {
            const payload = new FormData();
            payload.append("category", formData.category);
            payload.append("description", formData.description);
            payload.append("urgency", formData.urgency);
            payload.append("preferredDateTime", formData.preferredDateTime)
            if(provider){
            payload.append("targetProvider", provider.user._id); // auto-set from selected provider
            }
            
            payload.append("address", JSON.stringify({
                fullAddress: formData.fullAddress,
                city: formData.city,
                area: formData.area,
            }));

            if (formData.photo) {
                payload.append("photos", formData.photo);
            }

            const response = await fetch("http://127.0.0.1:5000/api/requests/openarequest", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: payload,
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Failed to send request. Try again.");
                setLoading(false);
                return;
            }

            onSuccess(); // parent ko batayein success hua, modal band karne ke liye
        } catch (err) {
            console.error("Request error:", err);
            setError("Unable to connect to server.");
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-box">
               <h2> {provider ? `Request ${provider.businessName}` : `Post a ${preSelectedCategory?.name} Request`}</h2>
                {error && <p className="field-error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    {/* form fields agle block mein aayenge */}
                      {provider &&(
                    <div className="form-group">
                        <label>Which service do you need?</label>
                        <select name="category" value={formData.category} onChange={handleChange}>
                            <option value="" disabled>Select a service</option>
                            {provider.services.map((service) => (
                                <option key={service.category._id} value={service.category._id}>
                                    {service.category.name}
                                </option>
                            ))}
                        </select>
                    </div>)}

                    <div className="form-group">
                        <label>Describe your problem</label>
                        <textarea
                            name="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="e.g. Fan not working, needs inspection"
                        />
                    </div>

                    <div className="form-group">
                        <label>Urgency</label>
                        <select name="urgency" value={formData.urgency} onChange={handleChange}>
                            <option value="" disabled>Select urgency</option>
                            <option value="low">Low — anytime this week</option>
                            <option value="medium">Medium — within 1-2 days</option>
                            <option value="high">High — as soon as possible</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Preferred Date & Time</label>
                        <input
                            type="datetime-local"
                            name="preferredDateTime"
                            value={formData.preferredDateTime}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Full Address</label>
                        <input
                            type="text"
                            name="fullAddress"
                            value={formData.fullAddress}
                            onChange={handleChange}
                            placeholder="House #, street, landmark"
                        />
                    </div>

                    <div className="form-group">
                        <label>City</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="e.g. Lahore"
                        />
                    </div>

                    <div className="form-group">
                        <label>Area (optional)</label>
                        <input
                            type="text"
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                            placeholder="e.g. Gulberg"
                        />
                    </div>
                    <div className="form-group">
                        <label>Photo (optional)</label>
                        <input type="file" name="photo" accept="image/*" onChange={handleChange} />
                    </div>
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" disabled={loading}>
                            {loading ? "Sending..." : "Send Request"}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default RequestServiceModal;