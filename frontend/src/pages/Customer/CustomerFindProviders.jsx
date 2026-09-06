import { useState } from "react";
import { Star, MapPin, BadgeCheck, SlidersHorizontal } from "lucide-react";
import "././css/FindProvider.css";


const CATEGORIES = ["All", "Electrician", "Plumber", "AC Technician", "Appliance Repair", "Carpenter"];

const PROVIDERS = [
  {
    id: 1,
    name: "Ali Electric Works",
    category: "Electrician",
    area: "Gulberg, Lahore",
    rating: 4.8,
    reviewCount: 132,
    isVerified: true,
    startingPrice: 500,
  },
  {
    id: 2,
    name: "Cool Breeze AC Services",
    category: "AC Technician",
    area: "Model Town, Lahore",
    rating: 4.9,
    reviewCount: 98,
    isVerified: true,
    startingPrice: 800,
  },
  {
    id: 3,
    name: "Speedy Plumbers",
    category: "Plumber",
    area: "Johar Town, Lahore",
    rating: 4.6,
    reviewCount: 54,
    isVerified: false,
    startingPrice: 400,
  },
  {
    id: 4,
    name: "Ahmed Carpentry",
    category: "Carpenter",
    area: "DHA Phase 5, Lahore",
    rating: 4.7,
    reviewCount: 76,
    isVerified: true,
    startingPrice: 600,
  },
  {
    id: 5,
    name: "Fix-It Appliance Repair",
    category: "Appliance Repair",
    area: "Iqbal Town, Lahore",
    rating: 4.5,
    reviewCount: 41,
    isVerified: false,
    startingPrice: 450,
  },
];

const CustomerFindProviders = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchArea, setSearchArea] = useState("");
  const [sortBy, setSortBy] = useState("rating");

  const filteredProviders = PROVIDERS
    .filter((p) => selectedCategory === "All" || p.category === selectedCategory)
    .filter((p) => p.area.toLowerCase().includes(searchArea.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price") return a.startingPrice - b.startingPrice;
      return 0;
    });

  return (
    <div className="find-providers-page">
      <div className="find-header">
        <h1 className="find-heading">Find Providers</h1>
        <p className="find-subtext">Browse trusted local professionals near you</p>
      </div>

     
      <div className="filters-bar">
        <div className="filter-group">
          <label>Category</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Area</label>
          <input
            type="text"
            placeholder="e.g. Gulberg, Lahore"
            value={searchArea}
            onChange={(e) => setSearchArea(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Sort by</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="rating">Highest Rated</option>
            <option value="price">Lowest Price</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {filteredProviders.length === 0 ? (
        <div className="empty-state">
          <SlidersHorizontal size={32} color="#9AA5AB" />
          <p>No providers match your filters. Try adjusting your search.</p>
        </div>
      ) : (
        <div className="providers-grid">
          {filteredProviders.map((provider) => (
            <div className="provider-result-card" key={provider.id}>
              <div className="provider-avatar-placeholder">
                {provider.name.charAt(0)}
              </div>

              <div className="provider-info">
                <div className="provider-name-row">
                  <span className="provider-result-name">{provider.name}</span>
                  {provider.isVerified && (
                    <BadgeCheck size={16} color="#2b7fff" />
                  )}
                </div>

                <span className="provider-result-category">{provider.category}</span>

                <span className="provider-result-area">
                  <MapPin size={13} /> {provider.area}
                </span>

                <div className="provider-result-bottom">
                  <span className="provider-result-rating">
                    <Star size={14} fill="#2b7fff" color="#2b7fff" />
                    {provider.rating} ({provider.reviewCount})
                  </span>
                  <span className="provider-result-price">
                    From PKR {provider.startingPrice}/hr
                  </span>
                </div>

                <button className="view-profile-btn">View Profile</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerFindProviders;