import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance";
import "./AdminDashboard.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  // ✅ Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/api/admin/users");
        setUsers(response.data);
      } catch (error) {
        console.error("❌ Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // ✅ Delete User
  const handleDeleteUser = async (id) => {
    try {
      await axiosInstance.delete(`/api/admin/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
      alert("✅ User deleted successfully!");
    } catch (error) {
      console.error("❌ Error deleting user:", error);
      alert("Failed to delete user.");
    }
  };

  return (
    <div className="manage-section">
      <h2>Manage Users</h2>
      <table className="modern-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button className="edit-btn" onClick={() => alert("Edit User Coming Soon!")}>Edit</button>
                <button className="delete-btn" onClick={() => handleDeleteUser(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
