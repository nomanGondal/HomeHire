import { useState } from "react";
import { Clock, MapPin, FileText, X } from "lucide-react";
import "././css/MyRequests.css";



const REQUESTS = [
  {
    id: 1,
    category: "AC Repair",
    description: "AC not cooling properly, might need gas refill.",
    area: "Model Town, Lahore",
    postedAgo: "2 hours ago",
    status: "open",
    quotesReceived: 3,
  },
  {
    id: 2,
    category: "Plumbing",
    description: "Kitchen sink leaking from the pipe joint.",
    area: "Johar Town, Lahore",
    postedAgo: "1 day ago",
    status: "open",
    quotesReceived: 0,
  },
  {
    id: 3,
    category: "Electrician",
    description: "Ceiling fan not working, needs inspection.",
    area: "Gulberg, Lahore",
    postedAgo: "3 days ago",
    status: "booked",
    quotesReceived: 4,
  },
  {
    id: 4,
    category: "Carpenter",
    description: "Wooden door hinge repair needed.",
    area: "DHA Phase 5, Lahore",
    postedAgo: "1 week ago",
    status: "closed",
    quotesReceived: 2,
  },
];

const statusConfig = {
  open: { label: "Open", className: "open" },
  quoted: { label: "Quotes Received", className: "quoted" },
  booked: { label: "Booked", className: "booked" },
  closed: { label: "Closed", className: "closed" },
};

const CustomerRequests = () => {
  const [requests, setRequests] = useState(REQUESTS);

  const handleCancel = (id) => {
    setRequests(requests.filter((r) => r.id !== id));
  };

  return (
    <div className="requests-page">
      <div className="requests-header">
        <h1 className="requests-heading">My Requests</h1>
        <p className="requests-subtext">Track the service requests you've posted</p>
      </div>

      {requests.length === 0 ? (
        <div className="requests-empty">
          <FileText size={32} color="#9AA5AB" />
          <p>You haven't posted any service requests yet.</p>
        </div>
      ) : (
        <div className="requests-list">
          {requests.map((request) => {
            const status = statusConfig[request.status];

            return (
              <div className="request-item-card" key={request.id}>
                <div className="request-item-top">
                  <span className="request-item-category">{request.category}</span>
                  <span className={`request-status-badge ${status.className}`}>
                    {status.label}
                  </span>
                </div>

                <p className="request-item-description">{request.description}</p>

                <div className="request-item-meta">
                  <span><MapPin size={13} /> {request.area}</span>
                  <span><Clock size={13} /> {request.postedAgo}</span>
                </div>

                <div className="request-item-bottom">
                  <span className="request-quotes-count">
                    {request.quotesReceived > 0
                      ? `${request.quotesReceived} quotes received`
                      : "Waiting for quotes"}
                  </span>

                  <div className="request-item-actions">
                    {request.quotesReceived > 0 && (
                      <button className="request-action-btn primary">View Quotes</button>
                    )}
                    {(request.status === "open" || request.status === "quoted") && (
                      <button
                        className="request-action-btn danger"
                        onClick={() => handleCancel(request.id)}
                      >
                        <X size={14} /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomerRequests;