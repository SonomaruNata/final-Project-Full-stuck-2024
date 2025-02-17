import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance";
import { useNavigate } from "react-router-dom";
import "../../styles/Profile.css"; // ✅ Ensure Profile Styles

const Profile = () => {
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("⚠️ No authentication token found!");
        setError("You need to log in to view your profile.");
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get("/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData({ name: response.data.name, email: response.data.email });
        setLoading(false);
      } catch (error) {
        console.error("❌ Error fetching profile:", error);
        setLoading(false);

        if (error.response) {
          if (error.response.status === 401) {
            localStorage.removeItem("token"); // ✅ Clear invalid token
            setError("Session expired. Please log in again.");
            setTimeout(() => navigate("/login"), 2000); // ✅ Delay redirect for better UX
          } else {
            setError("Failed to fetch profile. Please try again later.");
          }
        }
      }
    };

    fetchProfile();
  }, [navigate]); // ✅ Ensures useEffect only runs when `navigate` changes

  return (
    <div className="profile-container">
      <h2>User Profile</h2>

      {loading ? (
        <p className="loading-text">Loading profile...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <div className="profile-details">
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
