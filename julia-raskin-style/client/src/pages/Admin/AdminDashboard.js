// src/pages/Admin/AdminDashboard.js
import React from "react";
import ManageUsers from "./ManageUsers";
import ManageProducts from "./ManageProducts";
import ManageArticles from "./ManageArticles";
import ManageOrders from "./ManageOrders";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <ManageUsers />
      <ManageProducts />
      <ManageArticles />
      <ManageOrders />
    </div>
  );
};

export default AdminDashboard;
