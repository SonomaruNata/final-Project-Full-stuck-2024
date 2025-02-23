// src/pages/Admin/ManageUsers.js
import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import "./AdminDashboard.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/api/admin/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="admin-section">
      <h2>User Management</h2>
      <table className="modern-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Order History</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {user.address?.street}, {user.address?.city}, {user.address?.zip}
              </td>
              <td>
                {user.orders.length > 0 ? (
                  user.orders.map((order) => (
                    <p key={order._id}>
                      Order #{order._id} - ${order.total.toFixed(2)}
                    </p>
                  ))
                ) : (
                  <span>No Orders</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
