import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import "./EditInfo.css";

const EditInfo = () => {
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get("/users/profile");
        setUser(res.data);
      } catch (err) {
        setMessage("⚠️ Could not load profile.");
      }
    })();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axiosInstance.put("/users/profile", user);
      setEditing(false);
      setMessage("✅ Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("❌ Error updating profile.");
    }
  };

  return (
    <div className="edit-info-card">
      <h2>👤 Profile Details</h2>
      <label>Name</label>
      <input type="text" name="name" value={user.name || ""} onChange={handleChange} disabled={!editing} />

      <label>Email</label>
      <input type="email" name="email" value={user.email || ""} disabled />

      {editing ? (
        <button onClick={handleSave} className="save-btn">💾 Save</button>
      ) : (
        <button onClick={() => setEditing(true)} className="edit-btn">✏️ Edit Profile</button>
      )}

      {message && <p className="status-message">{message}</p>}
    </div>
  );
};

export default EditInfo;
