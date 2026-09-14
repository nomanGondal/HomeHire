import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    role: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.role) newErrors.role = "Please select a role.";

    if (!formData.fullName.trim())
      newErrors.fullName = "Full name is required.";

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

  const handleSubmit = async (e) => {
  e.preventDefault();
  const newErrors = validate();

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setErrors({});

  try {
    const response = await fetch("http://127.0.0.1:5000/api/auth/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Backend se error aaya (e.g. email already exists)
      setErrors({ form: data.message || "Something went wrong. Try again." });
      return;
    }

    console.log("OTP sent successfully:", data);
    navigate("/verify-otp", { state: { phone: formData.phone } });
    // Yahan hum OTP verification page pe navigate karenge (agla step)

  } catch (err) {
    console.error("Network error:", err);
    setErrors({ form: "Unable to connect to server. Check your connection." });
  }
};
  return (
    <div className="signup-page">
      <div className="signup-form-container">
        <h1 className="signup-heading">Create your Homehire Account</h1>
        <p className="signup-subtext">
          Fast signup for trusted local home services in Pakistan.
        </p>

        <form className="signup-form" onSubmit={handleSubmit} noValidate>

        
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Ayesha Malik"
              className={errors.fullName ? "input-error" : ""}
            />
            {errors.fullName && <span className="field-error">{errors.fullName}</span>}
          </div>


          {/* Role */}

            <div className="form-group">
            <label htmlFor="role">I am a</label>
            <div className="select-wrapper">
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={errors.role ? "input-error" : ""}
              >
                <option value="" disabled>Select your role</option>
                <option value="customer">Customer</option>
                <option value="provider">Service Provider</option>
              </select>
              <ChevronDown className="select-chevron" size={18} />
            </div>
            {errors.role && <span className="field-error">{errors.role}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+92 300 1234567"
              className={errors.phone ? "input-error" : ""}
            />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className={errors.confirmPassword ? "input-error" : ""}
            />
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          </div>

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