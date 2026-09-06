import { useState } from "react";
import {
  Briefcase,
  CheckCircle,
  Heart,
  Wallet,
  Zap,
  Droplet,
  Wind,
  Wrench,
  Hammer,
  MapPin,
  Star,
  Clock,
} from "lucide-react";
import "././css/Home.css";



const STATS = [
  { label: "Active Bookings", value: 2, icon: Briefcase },
  { label: "Completed Jobs", value: 14, icon: CheckCircle },
  { label: "Saved Providers", value: 5, icon: Heart },
  { label: "Total Spent", value: "PKR 38,600", icon: Wallet },
];

const SERVICE_CATEGORIES = [
  { id: 1, name: "Electrician", icon: Zap },
  { id: 2, name: "Plumber", icon: Droplet },
  { id: 3, name: "AC Technician", icon: Wind },
  { id: 4, name: "Appliance Repair", icon: Wrench },
  { id: 5, name: "Carpenter", icon: Hammer },
];

const ACTIVE_BOOKINGS = [
  {
    id: 1,
    providerName: "Ali Electric Works",
    category: "Electrician",
    date: "Today, 3:00 PM",
    status: "On the way",
  },
  {
    id: 2,
    providerName: "Cool Breeze AC Services",
    category: "AC Technician",
    date: "Tomorrow, 11:00 AM",
    status: "Confirmed",
  },
];

const RECENT_REQUESTS = [
  {
    id: 1,
    category: "AC Repair",
    postedAgo: "2 hours ago",
    quotesReceived: 3,
  },
  {
    id: 2,
    category: "Plumbing",
    postedAgo: "1 day ago",
    quotesReceived: 0,
  },
];

const NEARBY_PROVIDERS = [
  {
    id: 1,
    name: "Ahmed Carpentry",
    category: "Carpenter",
    area: "Gulberg, Lahore",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Speedy Plumbers",
    category: "Plumber",
    area: "Johar Town, Lahore",
    rating: 4.6,
  },
  {
    id: 3,
    name: "Cool Breeze AC Services",
    category: "AC Technician",
    area: "Model Town, Lahore",
    rating: 4.9,
  },
];

const CustomerHome = () => {
  const [userName] = useState("Ayesha"); 
  return (
    <div className="customer-home">
    
      <div className="home-header">
        <h1 className="home-heading">Welcome, {userName}</h1>
        <p className="home-subtext">What do you need help with today?</p>
      </div>

  
      <div className="home-stats-grid">
        {STATS.map(({ label, value, icon: Icon }) => (
          <div className="stat-card" key={label}>
            <div className="stat-icon">
              <Icon size={20} />
            </div>
            <div>
              <p className="stat-value">{value}</p>
              <p className="stat-label">{label}</p>
            </div>
          </div>
        ))}
      </div>

   
      <section className="home-section">
        <h2 className="section-title">Popular Services</h2>
        <div className="category-grid">
          {SERVICE_CATEGORIES.map(({ id, name, icon: Icon }) => (
            <button className="category-card" key={id}>
              <div className="category-icon">
                <Icon size={22} />
              </div>
              <span className="category-name">{name}</span>
            </button>
          ))}
        </div>
      </section>

     
      <section className="home-section">
        <div className="section-header-row">
          <h2 className="section-title">Active Bookings</h2>
          <a href="/customer/bookings" className="see-all-link">See all</a>
        </div>

        {ACTIVE_BOOKINGS.length === 0 ? (
          <p className="empty-text">You have no active bookings right now.</p>
        ) : (
          <div className="booking-list">
            {ACTIVE_BOOKINGS.map((booking) => (
              <div className="booking-card" key={booking.id}>
                <div>
                  <p className="booking-provider">{booking.providerName}</p>
                  <p className="booking-category">{booking.category}</p>
                </div>
                <div className="booking-right">
                  <span className="booking-date">
                    <Clock size={14} /> {booking.date}
                  </span>
                  <span className="booking-status">{booking.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      
      <section className="home-section">
        <div className="section-header-row">
          <h2 className="section-title">My Recent Requests</h2>
          <a href="/customer/requests" className="see-all-link">See all</a>
        </div>

        <div className="request-list">
          {RECENT_REQUESTS.map((request) => (
            <div className="request-card" key={request.id}>
              <div>
                <p className="request-category">{request.category}</p>
                <p className="request-time">{request.postedAgo}</p>
              </div>
              <span className="request-quotes">
                {request.quotesReceived > 0
                  ? `${request.quotesReceived} quotes received`
                  : "Waiting for quotes"}
              </span>
            </div>
          ))}
        </div>
      </section>

    
      <section className="home-section">
        <div className="section-header-row">
          <h2 className="section-title">Nearby Providers</h2>
          <a href="/customer/find-providers" className="see-all-link">See all</a>
        </div>

        <div className="provider-list">
          {NEARBY_PROVIDERS.map((provider) => (
            <div className="provider-card" key={provider.id}>
              <div>
                <p className="provider-name">{provider.name}</p>
                <p className="provider-category">{provider.category}</p>
                <span className="provider-area">
                  <MapPin size={13} /> {provider.area}
                </span>
              </div>
              <span className="provider-rating">
                <Star size={14} fill="#ece516" color="#ece516" /> {provider.rating}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CustomerHome;