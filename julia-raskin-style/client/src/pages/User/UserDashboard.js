import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import EditInfo from "./EditInfo"; // ✅ Import EditInfo
import Payment from "./Payment";   // ✅ Import Payment
import UserCart from "./UserCart"; // ✅ Import UserCart
import "./UserDashboard.css";

const UserDashboard = () => {
  const [user, setUser] = useState({});
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Dashboard Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axiosInstance.get("/api/users/profile");
        const ordersResponse = await axiosInstance.get("/api/users/orders");
        const cartResponse = await axiosInstance.get("/api/users/cart");

        setUser(userResponse.data);
        setOrders(ordersResponse.data);
        setCart(cartResponse.data.items);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="user-dashboard">
      <h1>Hello, {user.name}!</h1>

      {/* ✅ Edit Personal Information */}
      <EditInfo />

      {/* ✅ View and Edit Cart */}
      <UserCart cart={cart} />

      {/* ✅ Proceed to Payment */}
      <Payment cart={cart} />

      <h2>Your Orders</h2>
      {orders.length > 0 ? (
        <ul className="orders-list">
          {orders.map((order) => (
            <li key={order._id} className="order-item">
              <span>Order #{order._id}</span>
              <span>Status: {order.status}</span>
              <button className="btn btn-sm btn-info" onClick={() => alert("Edit Order Coming Soon!")}>
                Edit
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default UserDashboard;
