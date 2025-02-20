import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance";


const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch Orders from Backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get("/api/admin/orders");
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching orders:", err);
        setError("Failed to load orders.");
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // ✅ Update Order Status
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axiosInstance.put(`/api/admin/orders/${id}`, { status: newStatus });
      setOrders(
        orders.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );
      alert("✅ Order status updated successfully!");
    } catch (err) {
      console.error("❌ Error updating order status:", err);
      alert("Failed to update order status.");
    }
  };

  return (
    <div className="manage-orders">
      <h1>Manage Orders</h1>

      {/* Loading State */}
      {loading && <p>Loading orders...</p>}
      {error && <p className="error">{error}</p>}

      <ul className="list-group">
        {orders.map((order) => (
          <li
            key={order._id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>Order ID:</strong> {order._id}
              <br />
              <strong>Customer:</strong> {order.customer.name}
              <br />
              <strong>Total:</strong> ${order.total}
              <br />
              <strong>Status:</strong>{" "}
              <span
                className={`badge ${
                  order.status === "Shipped"
                    ? "bg-success"
                    : order.status === "Pending"
                    ? "bg-warning"
                    : "bg-secondary"
                }`}
              >
                {order.status}
              </span>
            </div>
            <div>
              <button
                className="btn btn-sm btn-primary me-2"
                onClick={() => handleUpdateStatus(order._id, "Shipped")}
              >
                Mark as Shipped
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleUpdateStatus(order._id, "Cancelled")}
              >
                Cancel Order
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageOrders;
