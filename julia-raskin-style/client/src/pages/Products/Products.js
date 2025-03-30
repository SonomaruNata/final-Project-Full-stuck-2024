import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Products.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products`);
        console.log("✅ Fetched products:", res.data);
        setProducts(res.data);
      } catch (err) {
        console.error("❌ Error loading products:", err.message);
        setError("⚠️ Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      await axios.post(
        `${API_URL}/api/cart`,
        { productId, quantity: 1 },
        { withCredentials: true }
      );
      alert("🛒 Added to cart!");
    } catch (err) {
      alert("❌ Error adding to cart.");
    }
  };

  const getValidImageUrl = (product) => {
    return product.imageUrl && product.imageUrl.includes("http")
      ? product.imageUrl
      : `${API_URL}/uploads/images/products/default.jpg`;
  };

  return (
    <div className="products-container">
      <h1>🛍️ Explore Our Products</h1>

      {loading ? (
        <p className="loading-text">Loading products...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <img
                src={getValidImageUrl(product)}
                alt={product.name}
                className="product-image"
                onError={(e) => {
                  e.target.src = `${API_URL}/uploads/images/products/default.jpg`;
                }}
              />
              <h3>{product.name}</h3>
              <p>${product.price?.toFixed(2)}</p>
              <div className="product-actions">
                <button
                  className="view-btn"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  View
                </button>
                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product._id)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
