import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import OrderItem from "../../components/OrderItem";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get("/api/orders/my-orders"); // ✅ Corrected endpoint
      setOrders(response.data);
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
      setError("Failed to load your orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="orders">
      <h2>Your Orders</h2>

      {loading && <p>Loading your orders...</p>}

      {!loading && error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <p>You haven't placed any orders yet.</p>
      )}

      {!loading && !error && orders.length > 0 && (
        orders.map((order) => (
          <OrderItem key={order._id} order={order} />
        ))
      )}
    </div>
  );
};

export default Orders;
