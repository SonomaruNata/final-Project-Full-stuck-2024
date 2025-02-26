import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadCart = async () => {
      if (localStorage.getItem("token")) {
        // Fetch from backend if logged in
        try {
          const response = await axios.get("http://localhost:5000/api/cart", {
            withCredentials: true,
          });
          setCartItems(response.data);
        } catch (err) {
          setError("Failed to load cart items.");
        }
      } else {
        // Load from localStorage if not logged in
        const localCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(localCart);
      }
    };
    loadCart();
  }, []);

  const addToCart = (product, quantity = 1) => {
    if (localStorage.getItem("token")) {
      // If logged in, add to backend cart
      axios.post(
        "http://localhost:5000/api/cart",
        { productId: product._id, quantity },
        { withCredentials: true }
      ).then(() => navigate("/cart"));
    } else {
      // If not logged in, save to localStorage
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
          <div key={item._id}>
            <h3>{item.name}</h3>
            <p>Quantity: {item.quantity}</p>
          </div>
        ))
      ) : (
        <p>Your Cart is Empty 🛒</p>
      )}
      <Link to="/order" className="checkout-btn">Proceed to Checkout</Link>
    </div>
  );
}

export default Cart;
