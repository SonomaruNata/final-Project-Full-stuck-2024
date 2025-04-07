import React, { lazy, Suspense, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FaUsers, FaBox, FaNewspaper, FaClipboardList } from "react-icons/fa";
import "./AdminDashboard.css";

// 💤 Lazy Loaded Components
const ManageUsers = lazy(() => import("./ManageUsers"));
const ManageProducts = lazy(() => import("./ManageProducts"));
const ManageArticles = lazy(() => import("./ManageArticles"));
const ManageOrders = lazy(() => import("./ManageOrders"));

// 🧠 Card Config
const dashboardItems = [
  { component: ManageUsers, icon: FaUsers, title: "Manage Users" },
  { component: ManageProducts, icon: FaBox, title: "Manage Products" },
  { component: ManageArticles, icon: FaNewspaper, title: "Manage Articles" },
  { component: ManageOrders, icon: FaClipboardList, title: "Manage Orders" },
];

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  // 🔐 Role Gate
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p>Welcome, <strong>{user.name}</strong> (Admin)</p>

      <div className="admin-grid">
        <Suspense fallback={<div className="loading-dashboard">Loading dashboard sections...</div>}>
          {dashboardItems.map(({ component: Component, icon: Icon, title }, index) => (
            <div className="admin-card" key={index}>
              <Icon className="admin-icon" />
              <h3>{title}</h3>
              <Component />
            </div>
          ))}
        </Suspense>
      </div>
    </div>
  );
};

export default AdminDashboard;
