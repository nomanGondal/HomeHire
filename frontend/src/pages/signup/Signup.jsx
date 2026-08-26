import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Briefcase } from "lucide-react";
import FormInput from "./components/FormInput";
import "./Signup.css";

const Signup = () => {
  const [role, setRole] = useState("customer"); // "customer" | "provider"

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\+92 3\d{2} \d{7}$/.test(formData.phone)) {
      newErrors.phone = "Use format: +92 300 1234567";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    // Backend not connected yet — just logging for now
    console.log("Signup data:", { role, ...formData });

    // navigate based on role once backend + auth exist
  };

  return (
    <div className="signup-page">
      <div className="signup-form-container">
        <h1 className="signup-heading">Create your Ustaad Account</h1>
        <p className="signup-subtext">
          Fast signup for trusted local home services in Pakistan.
        </p>

        {/* Role toggle */}
        <div className="role-toggle">
          <button
            type="button"
            className={`role-toggle-btn ${role === "customer" ? "active" : ""}`}
            onClick={() => setRole("customer")}
          >
            <User size={16} />
            Customer
          </button>
          <button
            type="button"
            className={`role-toggle-btn ${role === "provider" ? "active" : ""}`}
            onClick={() => setRole("provider")}
          >
            <Briefcase size={16} />
            Service Provider
          </button>
        </div>

        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          <FormInput
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="e.g. Ayesha Malik"
            error={errors.fullName}
          />

          <FormInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            error={errors.email}
          />

          <FormInput
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+92 300 1234567"
            error={errors.phone}
          />

          <FormInput
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="At least 6 characters"
            error={errors.password}
          />

          <FormInput
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your password"
            error={errors.confirmPassword}
          />

          <button type="submit" className="signup-submit-btn">
            Create Account
          </button>
        </form>

        <p className="signup-login-line">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;