import React, { lazy, Suspense, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FaUsers, FaBox, FaNewspaper, FaClipboardList } from "react-icons/fa";

const ManageUsers = lazy(() => import("./ManageUsers"));
const ManageProducts = lazy(() => import("./ManageProducts"));
const ManageArticles = lazy(() => import("./ManageArticles"));
const ManageOrders = lazy(() => import("./ManageOrders"));

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  if (!user || user.role !== "admin") return <Navigate to="/" replace />;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p>Welcome, <strong>{user.name}</strong> (Admin)</p>

      <div className="admin-grid">
        {[ 
          { comp: ManageUsers, icon: FaUsers, title: "Manage Users" },
          { comp: ManageProducts, icon: FaBox, title: "Manage Products" },
          { comp: ManageArticles, icon: FaNewspaper, title: "Manage Articles" },
          { comp: ManageOrders, icon: FaClipboardList, title: "Manage Orders" }
        ].map(({ comp: Component, icon: Icon, title }, index) => (
          <Suspense key={index} fallback={<div>Loading {title}...</div>}>
            <div className="admin-card">
              <Icon className="admin-icon" />
              <h3>{title}</h3>
              <Component />
            </div>
          </Suspense>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;

