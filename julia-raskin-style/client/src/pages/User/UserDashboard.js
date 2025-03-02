import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserDashboard.css";

function UserDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/profile", {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="user-dashboard">
      <h2>Welcome, {user?.name}</h2>
      <p>Email: {user?.email}</p>
      <p>Birthday: {new Date(user?.birthday).toDateString()}</p>
      <h3>Address:</h3>
      <p>{user?.address?.street}</p>
      <p>{user?.address?.city}, {user?.address?.state} {user?.address?.zipCode}</p>
      <p>{user?.address?.country}</p>
      <h3>Payment Preferences:</h3>
      <p>Card Holder: {user?.paymentPreferences?.cardHolderName}</p>
    </div>
  );
}

export default UserDashboard;


