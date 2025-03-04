import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import ManageUsers from "./ManageUsers";
import ManageProducts from "./ManageProducts";
import ManageArticles from "./ManageArticles";
import ManageOrders from "./ManageOrders";
import "./AdminDashboard.css";
import { FaUsers, FaBox, FaNewspaper, FaClipboardList } from "react-icons/fa";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p>Welcome, <strong>{user.name}</strong> (Admin)</p>

      <div className="admin-grid">
        <div className="admin-card">
          <FaUsers className="admin-icon" />
          <h3>Manage Users</h3>
          <ManageUsers />
        </div>
        <div className="admin-card">
          <FaBox className="admin-icon" />
          <h3>Manage Products</h3>
          <ManageProducts />
        </div>
        <div className="admin-card">
          <FaNewspaper className="admin-icon" />
          <h3>Manage Articles</h3>
          <ManageArticles />
        </div>
        <div className="admin-card">
          <FaClipboardList className="admin-icon" />
          <h3>Manage Orders</h3>
          <ManageOrders />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
