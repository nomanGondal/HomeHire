import { useEffect, useState } from "react";
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
import RequestServiceModal from "./RequestServiceModal";
import BookingsList from "../shared/Bookinglist";
import { Link } from "react-router-dom";
const STATS = [
  { label: "Active Bookings", value: 2, icon: Briefcase },
  { label: "Completed Jobs", value: 14, icon: CheckCircle },
  { label: "Saved Providers", value: 5, icon: Heart },
  { label: "Total Spent", value: "PKR 38,600", icon: Wallet },
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
  const [userName] = useState("Noman");

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);


  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/categories/");
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setShowRequestModal(true);
  };

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
          {categories.map((category) => (
            <button
              className="category-card"
              key={category._id}
              onClick={() => handleCategoryClick(category)}
            >
              <div className="category-icon">
                <Zap size={22} />
              </div>
              <span className="category-name">{category.name}</span>
            </button>
          ))}
        </div>
      </section>


      <section className="home-section">
        <div className="section-header-row">
          <h2 className="section-title">Active Bookings</h2>
          <Link path="/customer/bookings">See All</Link>
        </div>
          <BookingsList viewerRole="customer" limit={2} compact />
        
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

      {showRequestModal && (
  <RequestServiceModal
    provider={null}
    preSelectedCategory={selectedCategory}
    onClose={() => setShowRequestModal(false)}
    onSuccess={() => {
      setShowRequestModal(false);
      alert("Request posted successfully!");
    }}
  />
)}
    </div>
  );
};

export default CustomerHome;