// src/pages/User/UserCart.js
import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import "./UserCart.css";

const UserCart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axiosInstance.get("/api/cart");
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  return (
    <div className="user-cart">
      <h2>Your Cart</h2>
      {cartItems.length > 0 ? (
        <ul>
          {cartItems.map((item) => (
            <li key={item._id}>
              {item.product.name} - Quantity: {item.quantity}
            </li>
          ))}
        </ul>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default UserCart;
