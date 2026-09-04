import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
//import "./CheckProfile.css";

const CheckProfile = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfile = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          "http://127.0.0.1:5000/api/provider/profile/me",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 404) {
          // Profile doesn't exist yet
          navigate("/provider/profile/setup", { replace: true });
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to check profile");
        }

        // Profile exists
        console.log("hhhello")
        navigate("/provider/home", { replace: true });

      } catch (err) {
        console.error("Profile check error:", err);
        navigate("/login", { replace: true });
      }
    };

    checkProfile();
  }, [navigate]);

  return (
    <div className="check-profile-page">
      <p className="check-profile-text">Checking your profile...</p>
    </div>
  );
};

export default CheckProfile;