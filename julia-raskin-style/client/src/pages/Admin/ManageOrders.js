import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import "./AdminDashboard.css";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get("admin/orders");
        setOrders(response.data);
      } catch (err) {
        console.error("❌ Error fetching orders:", err);
        setError("❌ Failed to load orders.");
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="admin-section">
      <h2>📦 Order Management</h2>

      {error && <div className="error-message">{error}</div>}

      <table className="modern-table">
        <thead>
          <tr>
            <th>👤 User</th>
            <th>🛍️ Products</th>
            <th>💰 Total</th>
            <th>💳 Payment</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order._id}>
                <td>
                  {order.user?.name || "Unknown User"}<br />
                  <small>{order.user?.email || "—"}</small>
                </td>
                <td>
                  {order.items.map((item, index) => (
                    <p key={`${item.product._id}-${index}`}>
                      {item.product.name} × {item.quantity}
                    </p>
                  ))}
                </td>
                <td>${order.total?.toFixed(2) || "0.00"}</td>
                <td>
                  <span
                    className={
                      order.paymentStatus === "paid"
                        ? "status-paid"
                        : "status-pending"
                    }
                  >
                    {order.paymentStatus?.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">🚨 No orders available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageOrders;
