import { useState, useEffect } from "react";
import { Clock, MapPin, FileText, X } from "lucide-react";
import "././css/MyRequests.css"
import { useNavigate } from "react-router-dom";
const statusConfig = {
  open: { label: "Open", className: "open" },
  quoted: { label: "Quotes Received", className: "quoted" },
  booked: { label: "Booked", className: "booked" },
  closed: { label: "Closed", className: "closed" },
  cancelled: { label: "Cancelled", className: "cancelled" },
};

const CustomerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  
  useEffect(() => {
    const fetchMyRequests = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          "http://127.0.0.1:5000/api/requests/my",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log("the state data is ",data)
        setRequests(data.requests || []);

      } catch (err) {
        console.error("Failed to load requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRequests();
  }, []);
const handlecancle =async (request)=>{
      const token =localStorage.getItem(token)
  const response= await fetch(`http://127.0.0.1:5000/api/requests/${request.id}/cancel`,
    {
      method :"PUT",
      headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },

    }
  )
  console.log(response)
};
  
  return (
    <div className="requests-page">
      <div className="requests-header">
        <h1 className="requests-heading">My Requests</h1>
        <p className="requests-subtext">Track the service requests you've posted</p>
      </div>

      {loading ? (
        <p className="requests-empty">Loading your requests...</p>
      ) : requests.length === 0 ? (
        <div className="requests-empty">
          <FileText size={32} color="#9AA5AB" />
          <p>You haven't posted any service requests yet.</p>
        </div>
      ) : (
        <div className="requests-list">
          {requests.map((request) => {
            const status = statusConfig[request.status] || statusConfig.open;

            return (
              <div className="request-item-card" key={request._id}>
                <div className="request-item-top">
                  <span className="request-item-category">{request.category?.name}</span>
                  <span className={`request-status-badge ${status.className}`}>
                    {status.label}
                  </span>
                </div>

                <p className="request-item-description">{request.description}</p>

                <div className="request-item-meta">
                  <span>
                    <MapPin size={13} />
                    {request.address?.area ? `${request.address.area}, ` : ""}
                    {request.address?.city}
                  </span>
                  <span><Clock size={13} /> {new Date(request.createdAt).toLocaleDateString()}</span>
                </div>
                {request.status === "quoted" && (
                  <button
                    className="request-action-btn primary"
                    onClick={() =>
      navigate(`/customer/requests/${request._id}/quotes`, {
        state: { request },
      })
    }
                  >
                    View Quotes
                  </button>
                )}
                <button onClick={handlecancle(request)}>cancel request</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomerRequests;