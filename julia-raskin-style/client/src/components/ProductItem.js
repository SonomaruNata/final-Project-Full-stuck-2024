import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ProductItem.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ProductItem = ({ product }) => {
  const navigate = useNavigate();

  const addToCart = async () => {
    try {
      await axios.post(`${API_URL}/api/cart`, { productId: product._id, quantity: 1 }, { withCredentials: true });
      alert("🛒 Product added to cart!");
      navigate("/cart");
    } catch (error) {
      console.error("❌ Error adding product to cart:", error);
      alert("⚠️ Failed to add product to cart. Please try again.");
    }
  };

  return (
    <div className="product-item">
      <h4>{product.name}</h4>
      <img src={product.imageUrl} alt={product.name} className="product-image" />
      <p>${product.price.toFixed(2)}</p>
      <button className="add-to-cart-btn" onClick={addToCart}>Add to Cart</button>
    </div>
  );
};

export default ProductItem;
