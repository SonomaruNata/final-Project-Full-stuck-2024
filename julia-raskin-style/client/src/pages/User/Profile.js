import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance";
import { useNavigate } from "react-router-dom";
import "../../styles/Profile.css"; // Add custom styling

const Profile = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Fetch user profile after signup
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/users/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUserData({ name: response.data.name, email: response.data.email });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put("/users/profile", userData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Profile updated successfully!");
      navigate("/");
    } catch (error) {
      alert("Error updating profile. Try again.");
    }
  };

  return (
    <div className="profile-container">
      <h2>Complete Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={userData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          placeholder="Email"
          disabled
        />
        <input
          type="password"
          name="password"
          onChange={handleChange}
          placeholder="New Password (optional)"
        />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default Profile;
