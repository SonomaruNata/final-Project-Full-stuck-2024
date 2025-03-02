import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    birthday: "",
    address: {
      street: "",
      city: "",
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/profile", {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:5000/api/users/profile", user, {
        withCredentials: true,
      });
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile.");
    }
  };

  if (loading) return <div className="loader"></div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Update Profile</h2>
        <form onSubmit={updateProfile}>
          <div className="input-group">
            <input
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              placeholder="Name"
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="Email"
            />
          </div>
          <div className="input-group">
            <input
              type="date"
              value={user.birthday}
              onChange={(e) => setUser({ ...user, birthday: e.target.value })}
            />
          </div>
          <button type="submit" className="update-btn">
            Update
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
