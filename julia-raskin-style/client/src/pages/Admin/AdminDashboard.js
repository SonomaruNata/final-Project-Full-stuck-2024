// src/pages/Admin/AdminDashboard.js
import React from "react";
import ManageUsers from "./ManageUsers";
import ManageProducts from "./ManageProducts";
import ManageArticles from "./ManageArticles";
import ManageOrders from "./ManageOrders";
import "./AdminDashboard.css";
import { FaUsers, FaBox, FaNewspaper, FaClipboardList } from "react-icons/fa";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="admin-cards">
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
