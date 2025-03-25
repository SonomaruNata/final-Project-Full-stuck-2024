import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import "./AdminDashboard.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchProfile();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/admin/users");
      setUsers(response.data);
    } catch (err) {
      console.error("❌ Error fetching users:", err);
      setError("Unauthorized. Please log in again.");
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      setCurrentUserId(res.data._id);
    } catch {
      setCurrentUserId("");
    }
  };

  const handleDeleteUser = async (id) => {
    if (id === currentUserId) return alert("You cannot delete your own account.");
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axiosInstance.delete(`/admin/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      alert("❌ Error deleting user.");
    }
  };

  const handleRoleChange = async (id, newRole) => {
    if (id === currentUserId) return alert("You cannot change your own role.");

    try {
      await axiosInstance.put(`/admin/users/${id}/role`, { role: newRole });
      setUsers(
        users.map((u) => (u._id === id ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      alert("❌ Error updating user role.");
    }
  };

  return (
    <div className="admin-section">
      <h2>Manage Users</h2>
      {error && <p className="error-message">{error}</p>}
      <table className="modern-table">
        <thead>
          <tr>
            <th>👤 Name</th>
            <th>📧 Email</th>
            <th>🔑 Role</th>
            <th>⚙️ Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.role}
                  disabled={user._id === currentUserId}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteUser(user._id)}
                  disabled={user._id === currentUserId}
                >
                  🗑️ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
