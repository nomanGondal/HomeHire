// src/pages/shared/BookingsList.jsx
import { useState, useEffect } from "react";
import { Calendar, MapPin, Wallet, Phone, User } from "lucide-react";
import BookingDetailsModal from "./BookingDetailedModel";
import "./Bookinglist.css";

const statusConfig = {
    confirmed: { label: "Confirmed", className: "confirmed" },
    "in-progress": { label: "In Progress", className: "in-progress" },
    "waiting-for-customer-confirmation": { label: "Waiting for Customer Confirmation", className: "waiting" },
    completed: { label: "Completed", className: "completed" },
    cancelled: { label: "Cancelled", className: "cancelled" },
};

const Bookingslist = ({ viewerRole, limit, compact = false }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch("http://127.0.0.1:5000/api/bookings/my", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                const allBookings = data.bookings || [];
                setBookings(limit ? allBookings.slice(0, limit) : allBookings);
            } catch (err) {
                console.error("Failed to load bookings:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleUpdateStatus = async (bookingId, newStatus) => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                `http://127.0.0.1:5000/api/bookings/${bookingId}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ status: newStatus }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.error("Failed to update status:", data.message);
                return;
            }

            // Local list mein bhi turant update kar do, dobara fetch kiye bina
            setBookings((prev) =>
                prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
            );
        } catch (err) {
            console.error("Status update error:", err);
        }
    };
    // Whichever side the viewer ISN'T, show that person's details on the card
    const getCounterpart = (booking) =>
        viewerRole === "customer" ? booking.provider : booking.customer;

    return (
        <div className="bookings-page">
            {!compact && (
                <div className="bookings-header">
                    <h1 className="bookings-heading">My Bookings</h1>
                    <p className="bookings-subtext">
                        {viewerRole === "customer"
                            ? "Track your upcoming and past service bookings"
                            : "Jobs you've been booked for"}
                    </p>
                </div>
            )}

            {loading ? (
                <p className="bookings-empty">Loading bookings...</p>
            ) : bookings.length === 0 ? (
                <div className="bookings-empty">
                    <Calendar size={32} color="#9AA5AB" />
                    <p>No bookings yet.</p>
                </div>
            ) : (
                <div className="bookings-list">
                    {bookings.map((booking) => {
                        const counterpart = getCounterpart(booking);
                        const status = statusConfig[booking.status] || statusConfig.confirmed;

                        return (
                            <div className="booking-item-card" key={booking._id}>
                                <div className="booking-item-avatar">
                                    {counterpart?.name?.charAt(0).toUpperCase()}
                                </div>

                                <div className="booking-item-info">
                                    <div className="booking-item-top">
                                        <span className="booking-item-name">
                                            <User size={14} /> {counterpart?.name}
                                        </span>
                                        <span className={`booking-status-badge ${status.className}`}>
                                            {status.label}
                                        </span>
                                    </div>

                                    <span className="booking-item-category">{booking.category?.name}</span>

                                    <div className="booking-item-meta">
                                        <span>
                                            <Calendar size={13} />
                                            {new Date(booking.scheduledDateTime).toLocaleString()}
                                        </span>
                                        <span>
                                            <MapPin size={13} />
                                            {booking.address?.area && booking.address.area !== "nan"
                                                ? `${booking.address.area}, `
                                                : ""}
                                            {booking.address?.city}
                                        </span>
                                        <span>
                                            <Wallet size={13} /> PKR {booking.price}
                                        </span>
                                    </div>
                                </div>

                                {!compact && (
                                    <div className="booking-item-actions">
                                        <button
                                            className="booking-action-btn primary"
                                            onClick={() => setSelectedBooking(booking)}
                                        >
                                            View Details
                                        </button>
                                        {viewerRole === "provider" && (
                                            <>
                                                {booking.status === "confirmed" && (
                                                    <>
                                                        <button
                                                            className="booking-action-btn success"
                                                            onClick={() => handleUpdateStatus(booking._id, "in-progress")}
                                                        >
                                                            Mark In-Progress
                                                        </button>
                                                        <button
                                                            className="booking-action-btn danger"
                                                            onClick={() => handleUpdateStatus(booking._id, "cancelled")}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                )
                                                }

                                                {booking.status === "in-progress" && (
                                                    <button
                                                        className="booking-action-btn complete"
                                                        onClick={() => handleUpdateStatus(booking._id, "waiting-for-customer-confirmation")}
                                                    >
                                                        Mark Completed
                                                    </button>

                                                )}
                                                {booking.status === "waiting-for-customer-confirmation" && (
                                                    <button className="booking-action-btn wait" disabled>waiting....</button>
                                                )
                                                }

                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {selectedBooking && (
                <BookingDetailsModal
                    booking={selectedBooking}
                    viewerRole={viewerRole}
                    onClose={() => setSelectedBooking(null)}
                />
            )}
        </div>
    );
};

export default Bookingslist;