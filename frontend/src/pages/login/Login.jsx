import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../signup/Signup.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: "", 
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
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
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ form: data.message || "Invalid credentials. Try again." });
        setLoading(false);
        return;
      }

      // Save token for future authenticated requests
      localStorage.setItem("token", data.token);

      console.log("Login successful:", data);

      // Navigate based on role
      if (data.user?.role === "provider") {
        navigate("/provider/dashboard");
      } else {
        navigate("/customer/home");
      }

    } catch (err) {
      console.error("Network error:", err);
      setErrors({ form: "Unable to connect to server. Check your connection." });
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-form-container">
        <h1 className="signup-heading">Login to Ustaad</h1>
        <p className="signup-subtext">
          Welcome back. Login to continue.
        </p>

        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          {errors.form && (
            <p className="field-error" style={{ textAlign: "center" }}>
              {errors.form}
            </p>
          )}

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
            {errors.phone && (
              <span className="field-error">{errors.phone}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </div>

          <button type="submit" className="signup-submit-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="signup-login-line">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;