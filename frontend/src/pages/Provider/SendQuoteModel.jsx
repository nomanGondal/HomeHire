import { useState } from "react";
import "./css/SendQuoteModel.css"; // ya jahan aapki CSS files hain

const SendQuoteModal = ({ serviceRequestId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    price: "",
    message: "",
    estimatedDuration: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.price || !formData.message.trim() || !formData.estimatedDuration.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://127.0.0.1:5000/api/quotes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceRequest: serviceRequestId,
          price: Number(formData.price),
          message: formData.message,
          estimatedDuration: formData.estimatedDuration,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to send quote. Try again.");
        setLoading(false);
        return;
      }

      onSuccess();
    } catch (err) {
      console.error("Send quote error:", err);
      setError("Unable to connect to server.");
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Send Quote</h2>

        {error && <p className="field-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Price (PKR)</label>
            <input
              type="number"
              name="price"
              min="0"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g. 2000"
            />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea
              name="message"
              rows={3}
              value={formData.message}
              onChange={handleChange}
              placeholder="e.g. I can come tomorrow morning"
            />
          </div>

          <div className="form-group">
            <label>Estimated Duration</label>
            <input
              type="text"
              name="estimatedDuration"
              value={formData.estimatedDuration}
              onChange={handleChange}
              placeholder="e.g. 1-2 hours"
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Quote"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendQuoteModal;