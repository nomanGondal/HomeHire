import { useEffect, useState } from "react";
import { Star, MapPin, BadgeCheck } from "lucide-react";
import "././css/FindProvider.css";
import RequestServiceModal from "./RequestServiceModal";
const CustomerFindProviders = () => {
  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const fetchProviders = async (categoryId = "") => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const url = categoryId
      ? `http://localhost:5000/api/customerhome/providers?category=${categoryId}`
      : "http://localhost:5000/api/customerhome/providers";

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setProviders(data.providers || []);
      console.log("Fetched providers:", data.providers);
    } catch (error) {
      console.error("Error fetching providers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Fetching categories...");
    const fetchCategories = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://127.0.0.1:5000/api/categories/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setCategories(data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
    fetchProviders();
  }, []);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategoryId(value);
    fetchProviders(value);
  };

  const handleOpenRequest = (provider) => {
    setSelectedProvider(provider);
    console.log("Selected provider for request:", provider);
    setShowRequestModal(true);
  };

  return (
    <div className="find-providers-page">
      <h1 className="find-heading">Find Providers</h1>

      <select className="category-filter-select" value={categoryId} onChange={handleCategoryChange}>
        <option value="">ALL</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>

      {loading ? (
        <p className="find-loading">Loading providers...</p>
      ) : providers.length === 0 ? (
        <p className="find-loading">No providers found.</p>
      ) : (
        <div className="providers-grid">
          {providers.map((provider) => (
            <div className="provider-result-card" key={provider._id}>
              <div className="provider-avatar-placeholder">
                {provider.businessName?.charAt(0).toUpperCase()}
              </div>

              <div className="provider-info">
                <div className="provider-name-row">
                  <span className="provider-result-name">{provider.businessName}</span>
                  {provider.verificationStatus === "pending" && (
                    <BadgeCheck size={16} color="#2b7fff" />
                  )}
                </div>

                <div className="provider-category-tags">
                  {provider.services?.map((service) => (
                    <span className="category-tag" key={service._id}>
                      {service.category?.name}
                    </span>
                  ))}
                </div>

                <span className="provider-result-area">
                  <MapPin size={13} /> {provider.serviceArea}
                </span>

                <div className="provider-result-bottom">
                  <span className="provider-result-rating">
                    <Star size={14} fill="#2b7fff" color="#2b7fff" />
                    {provider.rating?.average > 0
                      ? `${provider.rating.average} (${provider.rating.count})`
                      : "No reviews yet"}
                  </span>
                  <span className="provider-result-price">
                    From PKR {Math.min(...provider.services.map((s) => s.hourlyRate))}/hr
                  </span>
                </div>

                <button className="view-profile-btn">View Profile</button>
                <button
                  className="view-profile-btn"
                  onClick={() => handleOpenRequest(provider)}
                >
                  Send Request
                </button>

              </div>
            </div>
          ))}
        </div>
      )}
     
     {showRequestModal && (
  <RequestServiceModal
    provider={selectedProvider}
    onClose={() => setShowRequestModal(false)}
    onSuccess={() => {
      setShowRequestModal(false);
      alert("Request sent successfully!");
    }}
  />
)}


    </div>
  );
};

export default CustomerFindProviders;