import { useNavigate, Link } from "react-router-dom";
import { User, Briefcase, ShieldCheck } from "lucide-react";
import RoleCard from "../signup/components/RoleCards";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();

  return (
    <div className="signup-page">
      <div className="signup-container">
        <p className="signup-eyebrow">
          Trusted, local, and verified service access
        </p>
        <h1 className="signup-heading">Get Started with Ustaad</h1>
        <p className="signup-subtext">
          Continue as a customer or service provider. Choose your role once
          and get moving fast with simple, local booking.
        </p>

        <div className="signup-tabs">
          <span className="signup-tab active">Create Account</span>
          <Link to="/login" className="signup-tab">
            Login
          </Link>
        </div>

        <div className="role-grid">
          <RoleCard
            icon={User}
            title="Customer"
            description="Find trusted local professionals for quick, clear, and reliable home service booking."
            buttonText="Continue as Customer"
            onClick={() => navigate("/signup/customer")}
          />
          <RoleCard
            icon={Briefcase}
            title="Service Provider"
            description="Get customers, manage requests, and grow your local business with verified leads."
            buttonText="Continue as Provider"
            onClick={() => navigate("/signup/provider")}
          />
        </div>

        <div className="signup-trust">
          <ShieldCheck size={16} />
          <span>Verification helps keep the marketplace safe and trustworthy.</span>
        </div>

        <p className="signup-note">
          One simple account. Just choose your role — customer or provider —
          and continue.
        </p>

        <p className="signup-footer-line">
          Urdu / English ready • Cash payment friendly • Local Pakistani providers
        </p>
      </div>
    </div>
  );
};

export default Signup;