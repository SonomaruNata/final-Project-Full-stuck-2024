import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext"; // ✅ Ensure auth context is available
import "./ProductItem.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ProductItem = ({ product }) => {
  const { user } = useContext(AuthContext); // ✅ Check if user is logged in
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const addToCart = async () => {
    if (!user) {
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }

    setMessage(null);
    setError(null);

    try {
      await axios.post(
        `${API_URL}/api/cart`,
        { productId: product._id, quantity: 1 },
        { withCredentials: true }
      );
      setMessage("🛒 Product added to cart!");
    } catch (err) {
      console.error("❌ Error adding product to cart:", err);
      setError(err.response?.data?.message || "⚠️ Failed to add product. Try again.");
    }
  };

  return (
    <div className="product-item">
      <img 
        src={product.imageUrl} 
        alt={product.name} 
        className="product-image" 
        loading="lazy"
      />
      <h4>{product.name}</h4>
      <p>${product.price.toFixed(2)}</p>

      <button className="add-to-cart-btn" onClick={addToCart}>Add to Cart</button>

      {/* ✅ Show Success or Error Message */}
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ProductItem;

