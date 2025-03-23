import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import "./UserDashboard.css";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get("/users/profile");
        setUser(response.data);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <div className="loader"></div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>👋 Welcome, {user?.name}</h2>
        <p className="dashboard-subtitle">Manage your account and orders here</p>

        <div className="dashboard-menu">
          <Link to="/user/edit-info" className="dashboard-link">✏️ Edit Profile</Link>
          <Link to="/user/orders" className="dashboard-link">📦 My Orders</Link>
          <Link to="/user/cart" className="dashboard-link">🛒 My Cart</Link>
          <Link to="/user/payment" className="dashboard-link">💳 Payment Methods</Link>
          <Link to="/user/change-password" className="dashboard-link">🔑 Change Password</Link>
          <Link to="/user/callback-request" className="dashboard-link">📞 Request Callback</Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
