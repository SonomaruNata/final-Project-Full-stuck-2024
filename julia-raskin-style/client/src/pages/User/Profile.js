import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Profile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    birthday: "",
    address: { street: "", city: "" },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users/profile`, {
          withCredentials: true,
        });
        setUser(res.data);
      } catch (err) {
        setError("⚠️ Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/users/profile`, user, { withCredentials: true });
      setSuccess("✅ Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("❌ Failed to update profile.");
    }
  };

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>👤 My Profile</h2>
        <form onSubmit={updateProfile}>
          {error && <p className="error-message">{error}</p>}
          <div className="input-group">
            <label>Name</label>
            <input type="text" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
          </div>

          <div className="input-group">
            <label>Birthday</label>
            <input type="date" value={user.birthday} onChange={(e) => setUser({ ...user, birthday: e.target.value })} />
          </div>

          <div className="input-group">
            <label>Street</label>
            <input type="text" value={user.address.street} onChange={(e) => setUser({ ...user, address: { ...user.address, street: e.target.value } })} />
          </div>

          <div className="input-group">
            <label>City</label>
            <input type="text" value={user.address.city} onChange={(e) => setUser({ ...user, address: { ...user.address, city: e.target.value } })} />
          </div>

          <button type="submit" className="update-btn">💾 Save Changes</button>
          {success && <p className="success-message">{success}</p>}
        </form>
      </div>
    </div>
  );
}

export default Profile;
