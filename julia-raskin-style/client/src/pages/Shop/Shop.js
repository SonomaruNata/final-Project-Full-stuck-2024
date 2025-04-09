import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Shop.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const fallbackImage = "/uploads/images/products/default.jpg";

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(`${API_URL}/api/products`);
      setProducts(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "⚠️ Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addToCart = async (productId) => {
    try {
      await axios.post(
        `${API_URL}/api/cart`,
        { productId, quantity: 1 },
        { withCredentials: true }
      );
      alert("🛒 Product added to cart!");
      navigate("/cart");
    } catch {
      alert("⚠️ Failed to add product to cart.");
    }
  };

  return (
    <div className="shop-container">
      <div className="shop-header">
        <h1>🛍️ Discover Our Collection</h1>
        <p>Timeless fashion curated just for you.</p>
        {products.length > 0 && (
          <p className="shop-count">Showing {products.length} Products</p>
        )}
      </div>

      {loading && <p className="loading-message">⏳ Loading products...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="shop-products">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="shop-card">
              <img
                src={product.imageUrl || fallbackImage}
                alt={product.name}
                className="product-image"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = fallbackImage;
                }}
              />
              <h3 className="shop-card-title">{product.name}</h3>
              <p className="shop-card-price">${product.price.toFixed(2)}</p>
              <div className="product-actions">
                <button onClick={() => navigate(`/product/${product._id}`)}>
                  Product Details
                </button>
                <button onClick={() => addToCart(product._id)}>Add to Cart</button>
              </div>
            </div>
          ))
        ) : (
          !loading && <p className="empty-state">🚨 No products found.</p>
        )}
      </div>
    </div>
  );
}

export default Shop;
