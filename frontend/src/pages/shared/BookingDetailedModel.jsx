// src/pages/shared/BookingDetailsModal.jsx
import { X, Calendar, MapPin, Wallet, Phone, FileText, MessageSquare } from "lucide-react";
import "./BookingModel.css";

const statusConfig = {
  confirmed: { label: "Confirmed", className: "confirmed" },
  completed: { label: "Completed", className: "completed" },
  cancelled: { label: "Cancelled", className: "cancelled" },
};

const BookingDetailedModal = ({ booking, viewerRole, onClose }) => {
  const counterpart = viewerRole === "customer" ? booking.provider : booking.customer;
  const counterpartLabel = viewerRole === "customer" ? "Provider" : "Customer";
  const status = statusConfig[booking.status] || statusConfig.confirmed;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="details-modal-header">
          <h2>Booking Details</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <span className={`booking-status-badge ${status.className}`}>{status.label}</span>

        <div className="details-section">
          <span className="details-label">{counterpartLabel}</span>
          <p className="details-value">{counterpart?.name}</p>
          {counterpart?.phone && (
            <p className="details-value-sub">
              <Phone size={13} /> {counterpart.phone}
            </p>
          )}
        </div>

        <div className="details-section">
          <span className="details-label">Category</span>
          <p className="details-value">{booking.category?.name}</p>
        </div>

        {booking.serviceRequest?.description && (
          <div className="details-section">
            <span className="details-label">
              <FileText size={13} /> Problem Description
            </span>
            <p className="details-value">{booking.serviceRequest.description}</p>
          </div>
        )}

        {booking.quote?.message && (
          <div className="details-section">
            <span className="details-label">
              <MessageSquare size={13} /> Quote Message
            </span>
            <p className="details-value">{booking.quote.message}</p>
          </div>
        )}

        <div className="details-section">
          <span className="details-label">
            <Calendar size={13} /> Scheduled
          </span>
          <p className="details-value">
            {new Date(booking.scheduledDateTime).toLocaleString()}
          </p>
        </div>

        <div className="details-section">
          <span className="details-label">
            <MapPin size={13} /> Address
          </span>
          <p className="details-value">
            {booking.address?.fullAddress}
            {booking.address?.area && booking.address.area !== "nan"
              ? `, ${booking.address.area}`
              : ""}
            , {booking.address?.city}
          </p>
        </div>

        <div className="details-section">
          <span className="details-label">
            <Wallet size={13} /> Price
          </span>
          <p className="details-value price">PKR {booking.price}</p>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailedModal;