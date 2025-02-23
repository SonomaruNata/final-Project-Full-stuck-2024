// src/pages/User/Orders.js
import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import OrderItem from "../../components/OrderItem";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get("/api/users/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  return (
    <div className="orders">
      <h2>Your Orders</h2>
      {orders.length > 0 ? (
        orders.map((order) => (
          <OrderItem key={order._id} order={order} />
        ))
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default Orders;
