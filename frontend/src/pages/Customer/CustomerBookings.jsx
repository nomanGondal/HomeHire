import { useState } from "react";
import { Calendar, MapPin, Wallet, Phone } from "lucide-react";
import "././css/Bookings.css";


const BOOKINGS = [
  {
    id: 1,
    providerName: "Ali Electric Works",
    category: "Electrician",
    date: "Today, 3:00 PM",
    area: "Gulberg, Lahore",
    price: 1500,
    status: "confirmed", 
  },
  {
    id: 2,
    providerName: "Cool Breeze AC Services",
    category: "AC Technician",
    date: "Tomorrow, 11:00 AM",
    area: "Model Town, Lahore",
    price: 2200,
    status: "confirmed",
  },
  {
    id: 3,
    providerName: "Speedy Plumbers",
    category: "Plumber",
    date: "2 Sep, 2026",
    area: "Johar Town, Lahore",
    price: 900,
    status: "completed",
  },
  {
    id: 4,
    providerName: "Fix-It Appliance Repair",
    category: "Appliance Repair",
    date: "28 Aug, 2026",
    area: "Iqbal Town, Lahore",
    price: 700,
    status: "cancelled",
  },
];

const TABS = [
  { key: "confirmed", label: "Upcoming" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

const statusLabels = {
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

const CustomerBookings = () => {
  const [activeTab, setActiveTab] = useState("confirmed");

  const filteredBookings = BOOKINGS.filter((b) => b.status === activeTab);

  return (
    <div className="bookings-page">
      <div className="bookings-header">
        <h1 className="bookings-heading">My Bookings</h1>
        <p className="bookings-subtext">Track your upcoming and past service bookings</p>
      </div>

    
      <div className="bookings-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`booking-tab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filteredBookings.length === 0 ? (
        <div className="bookings-empty">
          <Calendar size={32} color="#9AA5AB" />
          <p>No {TABS.find((t) => t.key === activeTab)?.label.toLowerCase()} bookings.</p>
        </div>
      ) : (
        <div className="bookings-list">
          {filteredBookings.map((booking) => (
            <div className="booking-item-card" key={booking.id}>
              <div className="booking-item-avatar">
                {booking.providerName.charAt(0)}
              </div>

              <div className="booking-item-info">
                <div className="booking-item-top">
                  <span className="booking-item-name">{booking.providerName}</span>
                  <span className={`booking-status-badge ${booking.status}`}>
                    {statusLabels[booking.status]}
                  </span>
                </div>

                <span className="booking-item-category">{booking.category}</span>

                <div className="booking-item-meta">
                  <span><Calendar size={13} /> {booking.date}</span>
                  <span><MapPin size={13} /> {booking.area}</span>
                  <span><Wallet size={13} /> PKR {booking.price}</span>
                </div>
              </div>

              <div className="booking-item-actions">
                {booking.status === "confirmed" && (
                  <>
                    <button className="booking-action-btn primary">
                      <Phone size={14} /> Contact
                    </button>
                    <button className="booking-action-btn danger">Cancel</button>
                  </>
                )}
                {booking.status === "completed" && (
                  <button className="booking-action-btn primary">Leave Review</button>
                )}
                {booking.status === "cancelled" && (
                  <button className="booking-action-btn">Book Again</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerBookings;