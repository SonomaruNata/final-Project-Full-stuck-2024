// src/pages/Admin/AdminDashboard.js

import React from "react";
import ManageUsers from "./ManageUsers";
import ManageProducts from "./ManageProducts";
import ManageArticles from "./ManageArticles";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1>Hello, Admin!</h1>
      
      {/* Manage Users Section */}
      <section>
        <h2>Manage Users</h2>
        <ManageUsers />
      </section>

      {/* Manage Products Section */}
      <section>
        <h2>Manage Products</h2>
        <ManageProducts />
      </section>

      {/* Manage Articles Section */}
      <section>
        <h2>Manage Articles</h2>
        <ManageArticles />
      </section>
    </div>
  );
};

export default AdminDashboard;
