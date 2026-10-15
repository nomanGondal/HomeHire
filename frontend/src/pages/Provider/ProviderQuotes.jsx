
import { useState, useEffect } from "react";
import { FileText, MapPin, Clock, Wallet, Calendar, AlertCircle } from "lucide-react";
import "./css/ProviderQoutes.css";
import {apiUrl} from "../../lib/api"
const TABS = [
  { key: "", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "rejected", label: "Rejected" },
  {key: "withdrawn", label : "Withdrawn"}
];

const statusConfig = {
  pending: { label: "Pending", className: "pending" },
  accepted: { label: "Accepted", className: "accepted" },
  rejected: { label: "Rejected", className: "rejected" },
  withdrawn:{label : "Withdrawn", className:"withdrawn"}
};

const urgencyLabels = {
  low: "Low urgency",
  medium: "Medium urgency",
  high: "High urgency",
};

const ProviderQuotes = () => {
  const [activeTab, setActiveTab] = useState("");
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Re-fetches whenever the selected tab changes
  useEffect(() => {
    const fetchQuotes = async () => {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const url = activeTab
        ? apiUrl(`api/quotes/my?status=${activeTab}`)
        : apiUrl("api/quotes/my");

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Unable to load quotes.");
          setQuotes([]);
          return;
        }

        setQuotes(data.quotes || []);
      } catch (err) {
        console.error("Failed to load quotes:", err);
        setError("Unable to connect to server.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, [activeTab]);

  const emptyLabel = TABS.find((t) => t.key === activeTab)?.label.toLowerCase();

  return (
    <div className="pquotes-page">
      <div className="pquotes-header">
        <h1 className="pquotes-heading">My Quotes</h1>
        <p className="pquotes-subtext">Track the quotes you've sent to customers</p>
      </div>

      {/* Status tabs */}
      <div className="pquotes-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.label}
            className={`pquotes-tab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="pquotes-empty">Loading quotes...</p>
      ) : error ? (
        <p className="field-error">{error}</p>
      ) : quotes.length === 0 ? (
        <div className="pquotes-empty">
          <FileText size={32} color="#9AA5AB" />
          <p>
            {activeTab ? `No ${emptyLabel} quotes.` : "You haven't sent any quotes yet."}
          </p>
        </div>
      ) : (
        <div className="pquotes-list">
          {quotes.map((quote) => {
            const status = statusConfig[quote.status] || statusConfig.pending;
            const request = quote.serviceRequest;

            return (
              <div className="pquote-card" key={quote._id}>
                <div className="pquote-top">
                  <span className="pquote-category">{request?.category?.name}</span>
                  <span className={`pquote-status-badge ${status.className}`}>
                    {status.label}
                  </span>
                </div>

                <p className="pquote-description">{request?.description}</p>

                <div className="pquote-meta">
                  <span>
                    <MapPin size={13} />
                    {request?.address?.area ? `${request.address.area}, ` : ""}
                    {request?.address?.city}
                  </span>
                  {request?.preferredDateTime && (
                    <span>
                      <Calendar size={13} />
                      {new Date(request.preferredDateTime).toLocaleString()}
                    </span>
                  )}
                  {request?.urgency && (
                    <span>
                      <AlertCircle size={13} /> {urgencyLabels[request.urgency]}
                    </span>
                  )}
                </div>

                {/* The provider's own offer */}
                <div className="pquote-offer">
                  <div className="pquote-offer-row">
                    <span className="pquote-price">
                      <Wallet size={15} /> PKR {quote.price}
                    </span>
                    <span className="pquote-duration">
                      <Clock size={13} /> Est. {quote.estimatedDuration}
                    </span>
                  </div>
                  {quote.message && (
                    <p className="pquote-message">"{quote.message}"</p>
                  )}
                </div>

                <span className="pquote-sent">
                  Sent {new Date(quote.createdAt).toLocaleDateString()}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProviderQuotes;