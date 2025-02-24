// src/pages/User/UserDashboard.js
import React, { useState } from "react";
import EditInfo from "./EditInfo";
import Orders from "./Orders";
import UserCart from "./UserCart";
import Payment from "./Payment";
import "./UserDashboard.css";
import { FaUser, FaBoxOpen, FaShoppingCart, FaCreditCard } from "react-icons/fa";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="user-dashboard">
      <h1>Your Account</h1>
      <nav className="dashboard-nav">
        <button
          className={activeTab === "profile" ? "active" : ""}
          onClick={() => setActiveTab("profile")}
        >
          <FaUser /> Profile
        </button>
        <button
          className={activeTab === "orders" ? "active" : ""}
          onClick={() => setActiveTab("orders")}
        >
          <FaBoxOpen /> Orders
        </button>
        <button
          className={activeTab === "cart" ? "active" : ""}
          onClick={() => setActiveTab("cart")}
        >
          <FaShoppingCart /> Cart
        </button>
        <button
          className={activeTab === "payment" ? "active" : ""}
          onClick={() => setActiveTab("payment")}
        >
          <FaCreditCard /> Payment
        </button>
      </nav>

      <div className="dashboard-content">
        {activeTab === "profile" && <EditInfo />}
        {activeTab === "orders" && <Orders />}
        {activeTab === "cart" && <UserCart />}
        {activeTab === "payment" && <Payment />}
      </div>
    </div>
  );
};

export default UserDashboard;

