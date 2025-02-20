import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance";

const EditInfo = () => {
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);

  // ✅ Fetch User Info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get("/api/users/profile");
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user info:", error);
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  // ✅ Handle Info Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put("/api/users/profile", userData);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Update failed. Try again.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="edit-info">
      <h2>Edit Personal Information</h2>
      <form onSubmit={handleUpdate}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={userData.email}
            className="form-control"
            disabled
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Save Changes</button>
      </form>
    </div>
  );
};

export default EditInfo;
