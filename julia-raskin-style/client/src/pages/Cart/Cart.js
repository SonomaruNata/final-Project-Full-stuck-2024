import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Fetch Cart Items
  useEffect(() => {
    const loadCart = async () => {
      if (localStorage.getItem("token")) {
        try {
          const response = await axios.get(`${API_URL}/api/cart`, { withCredentials: true });
          setCartItems(response.data);
        } catch (err) {
          setError("⚠️ Failed to load cart items.");
        }
      } else {
        // ✅ Load from localStorage for Guests
        setCartItems(JSON.parse(localStorage.getItem("cart")) || []);
      }
    };
    loadCart();
  }, []);

  // ✅ Add Item to Cart (Local Storage + Backend)
  const addToCart = (product, quantity = 1) => {
    if (localStorage.getItem("token")) {
      axios
        .post(`${API_URL}/api/cart`, { productId: product._id, quantity }, { withCredentials: true })
        .then(() => navigate("/cart"))
        .catch(() => alert("⚠️ Could not add to cart."));
    } else {
      const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
      const updatedCart = [...existingCart, { ...product, quantity }];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCartItems(updatedCart);
    }
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">🛍️ Your Stylish Cart</h2>
      {cartItems.length > 0 ? (
        cartItems.map((item) => (
          <div key={item._id} className="cart-item">
            <h3>{item.name}</h3>
            <p>Quantity: {item.quantity}</p>
          </div>
        ))
      ) : (
        <p>Your Cart is Empty 🛒</p>
      )}
      <Link to="/order" className="checkout-btn">
        Proceed to Checkout
      </Link>
    </div>
  );
}

export default Cart;
