// src/pages/User/UserDashboard.js
import React, { useState } from "react";
import EditInfo from "./EditInfo";
import Orders from "./Orders";
import UserCart from "./UserCart";
import Payment from "./Payment";
import "./UserDashboard.css";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="user-dashboard">
      <h1>Your Account</h1>
      <nav className="dashboard-nav">
        <button onClick={() => setActiveTab("profile")}>Profile</button>
        <button onClick={() => setActiveTab("orders")}>Orders</button>
        <button onClick={() => setActiveTab("cart")}>Cart</button>
        <button onClick={() => setActiveTab("payment")}>Payment</button>
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
