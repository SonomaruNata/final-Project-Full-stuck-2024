// src/pages/User/EditInfo.js
import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";

const EditInfo = () => {
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get("/api/users/profile");
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axiosInstance.put("/api/users/profile", user);
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="edit-info">
      <h2>Profile Information</h2>
      <input
        type="text"
        name="name"
        value={user.name || ""}
        onChange={handleChange}
        disabled={!editing}
      />
      <input
        type="email"
        name="email"
        value={user.email || ""}
        disabled
      />
      {editing ? (
        <button onClick={handleSave}>Save</button>
      ) : (
        <button onClick={() => setEditing(true)}>Edit Profile</button>
      )}
    </div>
  );
};

export default EditInfo;
