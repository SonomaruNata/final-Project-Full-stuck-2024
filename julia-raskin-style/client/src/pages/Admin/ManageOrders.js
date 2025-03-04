// src/pages/Admin/ManageOrders.js
import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import "./AdminDashboard.css";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get("admin/orders");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="admin-section">
      <h2>Order Management</h2>
      <table className="modern-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Products</th>
            <th>Total Sum</th>
            <th>Payment Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>
                {order.user.name} <br />
                <small>{order.user.email}</small>
              </td>
              <td>
                {order.items.map((item) => (
                  <p key={item.product._id}>
                    {item.product.name} x {item.quantity}
                  </p>
                ))}
              </td>
              <td>${order.total.toFixed(2)}</td>
              <td>{order.paymentStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageOrders;
