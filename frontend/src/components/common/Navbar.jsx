import { Wrench } from 'lucide-react';
import {Link} from 'react-router-dom'
import "../CSS/Navbar.css"
const Navbar = () => {
  return (
       <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <Wrench size={22} strokeWidth={2.2} />
        <div className="navbar-brand">
          <span className="navbar-title">Ustaad</span>
          <span className="navbar-tagline">Trusted local home services</span>
        </div>
      </Link>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>
        <Link to="/providers">Become a Provider</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup" className="navbar-cta">Sign Up</Link>
      </div>
    </nav>
  )
}

export default Navbar