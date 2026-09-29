import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Wallet, Clock, ArrowLeft, MapPin } from "lucide-react";
import "./css/Quotes.css";

const CustomerQuotes = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const [request, setRequest] = useState(location.state?.request || null);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchQuotes = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/requests/${requestId}/quotes`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setQuotes(data.quotes || []);
    } catch (err) {
      console.error("Failed to load quotes:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchQuotes();
}, [requestId]);

useEffect(() => {
  const fetchQuotes = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/requests/${requestId}/quotes`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setQuotes(data.quotes || []);
    } catch (err) {
      console.error("Failed to load quotes:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchQuotes();
}, [requestId]);

const handleViewProfile = (providerId) => {
  navigate(`/customer/provider/${providerId}`);
};

const handleConfirmBooking = (quoteId) => {
  // backend endpoint confirm hone ke baad yahan API call aayegi
  console.log("Confirm booking for quote:", quoteId);
};


  return (
  <div className="quotes-page">
    <button className="back-link-btn" onClick={() => navigate("/customer/requests")}>
      <ArrowLeft size={16} /> Back to My Requests
    </button>

    <h1 className="quotes-heading">Received Quotes</h1>

    {/* Request context */}
    {request && (
      <div className="request-context-card">
        <span className="request-context-category">{request.category?.name}</span>
        <p className="request-context-description">{request.description}</p>
        <span className="request-context-area">
          <MapPin size={13} />
          {request.address?.area ? `${request.address.area}, ` : ""}
          {request.address?.city}
        </span>
      </div>
    )}

    {/* Quotes list */}
    {loading ? (
      <p className="quotes-empty">Loading quotes...</p>
    ) : quotes.length === 0 ? (
      <p className="quotes-empty">No quotes received yet.</p>
    ) : (
      <div className="quotes-list">
        {quotes.map((quote) => (
          <div className="quote-card" key={quote._id}>
            <div className="quote-card-top">
              <span className="quote-provider-name">{quote.provider?.name}</span>
              <span className="quote-price">
                <Wallet size={14} /> PKR {quote.price}
              </span>
            </div>

            <p className="quote-message">{quote.message}</p>

            <span className="quote-meta">
              <Clock size={13} /> Est. {quote.estimatedDuration}
            </span>

            <div className="quote-actions">
              <button
                className="quote-btn secondary"
                onClick={() => handleViewProfile(quote.provider._id)}
              >
                View Profile
              </button>
              <button
                className="quote-btn primary"
                onClick={() => handleConfirmBooking(quote._id)}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)
};

export default CustomerQuotes;