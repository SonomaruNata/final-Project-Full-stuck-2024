import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "./ProductItem.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ProductItem = ({ product }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const addToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setMessage(null);
      setError(null);

      await axios.post(
        `${API_URL}/api/cart`,
        { productId: product._id, quantity: 1 },
        { withCredentials: true }
      );

      setMessage("🛒 Product added to cart!");
    } catch (err) {
      console.error("❌ Cart Error:", err);
      setError("⚠️ Could not add product to cart.");
    }
  };

  return (
    <div className="product-item">
      <img
        src={product.imageUrl}
        alt={product.name || "product"}
        className="product-image"
        loading="lazy"
      />
      <h4>{product.name}</h4>
      <p>${product.price?.toFixed(2)}</p>
      <button className="add-to-cart-btn" onClick={addToCart}>
        Add to Cart
      </button>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ProductItem;
