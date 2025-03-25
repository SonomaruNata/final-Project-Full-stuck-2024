import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProductDetails.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  const fetchProduct = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products/${id}`);
      setProduct(res.data);
    } catch {
      setError("❌ Failed to load product.");
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const addToCart = async () => {
    try {
      await axios.post(`${API_URL}/api/cart`, { productId: id, quantity }, { withCredentials: true });
      alert("✅ Product added to cart!");
      navigate("/cart");
    } catch (err) {
      alert("❌ Failed to add product to cart.");
    }
  };

  return (
    <div className="product-details-container">
      {error ? (
        <p className="error-text">{error}</p>
      ) : product ? (
        <div className="product-details-card">
          <div className="product-image-wrapper">
            <img src={product.imageUrl} alt={product.name} className="product-image" />
          </div>
          <div className="product-info">
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <h3>${product.price}</h3>
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
            <button className="add-to-cart-btn" onClick={addToCart}>
              Add to Cart 🛒
            </button>
          </div>
        </div>
      ) : (
        <p className="loading-text">Loading...</p>
      )}
    </div>
  );
}

export default ProductDetails;
