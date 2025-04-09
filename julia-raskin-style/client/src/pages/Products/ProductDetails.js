import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProductDetails.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const fallbackImage = "/uploads/images/products/default.jpg";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  // 🔄 Fetch single product
  const fetchProduct = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error("❌ Fetch Error:", err);
      setError("❌ Failed to load product.");
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // 🛒 Add product to cart
  const addToCart = async () => {
    try {
      await axios.post(
        `${API_URL}/api/cart`,
        { productId: id, quantity },
        { withCredentials: true }
      );
      alert("✅ Product added to cart!");
      navigate("/cart");
    } catch (err) {
      console.error("❌ Add to Cart Error:", err);
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
            <img
              src={product.imageUrl || fallbackImage}
              alt={product.name}
              className="product-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = fallbackImage;
              }}
            />
          </div>
          <div className="product-info">
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <h3>${product.price.toFixed(2)}</h3>

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
        <p className="loading-text">⏳ Loading product details...</p>
      )}
    </div>
  );
}

export default ProductDetails;
