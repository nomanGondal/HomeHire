import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Home, Search, Calendar, MessageSquare, FileText, User, LogOut } from "lucide-react";
import "../css/CustomerLayout.css";

const navItems = [
  { to: "/customer/home", label: "Home", icon: Home },
  { to: "/customer/find-providers", label: "Find Providers", icon: Search },
  { to: "/customer/bookings", label: "My Bookings", icon: Calendar },
  { to: "/customer/messages", label: "Messages", icon: MessageSquare },
  { to: "/customer/requests", label: "My Requests", icon: FileText },
  { to: "/customer/profile", label: "Profile", icon: User },
];

const CustomerLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="customer-layout">
      <aside className="customer-sidebar">
        <div className="sidebar-logo">Homehire</div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      <div className="customer-main">
        <main className="customer-content">
          <Outlet />
        </main>

        <footer className="customer-footer">
          <span className="footer-copyright">
            © {new Date().getFullYear()} Homehire. All rights reserved.
          </span>
          <div className="footer-links">
            <a href="/support">Help</a>
            <a href="/terms">Terms</a>
            <a href="/privacy">Privacy Policy</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CustomerLayout;