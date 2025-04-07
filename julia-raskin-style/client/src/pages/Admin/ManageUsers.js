import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import "./AdminDashboard.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchProfile();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Error fetching users:", err);
      setError("❌ Unauthorized. Please log in again.");
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
    if (id === currentUserId) {
      return alert("⚠️ You cannot delete your own account.");
    }
    if (!window.confirm("🛑 Are you sure you want to delete this user?")) return;

    try {
      await axiosInstance.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setFeedback("🗑️ User deleted.");
    } catch (err) {
      console.error("❌ Delete Error:", err);
      setError("❌ Error deleting user.");
    }
  };

  const handleRoleChange = async (id, newRole) => {
    if (id === currentUserId) {
      return alert("⚠️ You cannot change your own role.");
    }

    try {
      await axiosInstance.put(`/admin/users/${id}/role`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
      );
      setFeedback("🔄 User role updated.");
    } catch (err) {
      console.error("❌ Role Update Error:", err);
      setError("❌ Failed to update role.");
    }
  };

  return (
    <div className="admin-section">
      <h2>👥 Manage Users</h2>

      {feedback && <p className="success-message">{feedback}</p>}
      {error && <p className="error-message">{error}</p>}

      {users.length === 0 ? (
        <p>🚨 No users found or you are unauthorized.</p>
      ) : (
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
            {users.map(({ _id, name, email, role }) => (
              <tr key={_id}>
                <td>{name}</td>
                <td>{email}</td>
                <td>
                  <select
                    value={role}
                    disabled={_id === currentUserId}
                    onChange={(e) => handleRoleChange(_id, e.target.value)}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td>
                  <button
                    className="delete-btn"
                    disabled={_id === currentUserId}
                    onClick={() => handleDeleteUser(_id)}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageUsers;
