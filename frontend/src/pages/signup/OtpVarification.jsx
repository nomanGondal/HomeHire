import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Signup.css";

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone;

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code.trim() || code.length !== 6) {
      setError("Enter the 6-digit code sent to your phone.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid or expired code. Try again.");
        setLoading(false);
        return;
      }

      console.log("Verified successfully:", data);
      navigate("/login");

    } catch (err) {
      console.error("Network error:", err);
      setError("Unable to connect to server. Check your connection.");
      setLoading(false);
    }
  };

  if (!phone) {
    return (
      <div className="signup-page">
        <div className="signup-form-container">
          <p className="signup-subtext">
            No phone number found. Please sign up again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-page">
      <div className="signup-form-container">
        <h1 className="signup-heading">Verify your phone</h1>
        <p className="signup-subtext">
          We sent a 6-digit code to <strong>{phone}</strong>
        </p>

        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="otp">Verification Code</label>
            <input
              id="otp"
              name="code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={handleChange}
              placeholder="Enter 6-digit code"
              className={error ? "input-error" : ""}
            />
            {error && <span className="field-error">{error}</span>}
          </div>

          <button type="submit" className="signup-submit-btn" disabled={loading}>
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;