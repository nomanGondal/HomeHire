import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Home, Wrench, Calendar, MessageSquare, FileText, User, LogOut } from "lucide-react";
import "./ProviderLayout.css";

const navItems = [
  { to: "/provider/home", label: "Home", icon: Home },
  { to: "/provider/services", label: "Services", icon: Wrench },
  { to: "/provider/bookings", label: "Bookings", icon: Calendar },
  { to: "/provider/messages", label: "Messages", icon: MessageSquare },
  { to: "/provider/quotes", label: "Quotes", icon: FileText },
  { to: "/provider/profile", label: "Profile", icon: User },
];

const ProviderLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="provider-layout">
      <aside className="provider-sidebar">
        <div className="sidebar-logo">Ustaad</div>

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

      <main className="provider-content">
        <Outlet />
      </main>
    </div>
  );
};

export default ProviderLayout;