import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Home.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const fallbackImage = "/uploads/images/products/default.jpg";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🛒 Fetch Featured Products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_URL}/api/products`);
      setProducts(res.data.slice(0, 4)); // 🎯 Only show 4
    } catch (err) {
      setError("❌ Failed to load products. Please try again.");
      console.error("❌ Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="home-container">
      {/* 🎯 HERO */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Julia Raskin Style</h1>
          <p>Discover the Art of Timeless Elegance and Unmatched Luxury</p>
          <p>Unleash your inner fashionista and inspire the world with your style.</p>
        </div>
      </section>

      {/* 🛍️ SHOP NOW */}
      <section className="shop-section">
        <h2>Shop Our Exclusive Collections</h2>
        <p>Discover the latest trends and timeless pieces that elevate your wardrobe.</p>
        <Link to="/shop" className="btn shop-btn">Shop Now</Link>
      </section>

      {/* 🧠 SHOPPING SCHOOL */}
      <section className="shopping-school-section">
        <h2>Want to Learn How to Look Stylish?</h2>
        <p>Discover the secrets of timeless elegance and modern chic.</p>
        <Link to="/shopping-school" className="btn learn-more-btn">Learn More</Link>
      </section>

      {/* 🌟 FEATURED PRODUCTS */}
      <section className="featured-products">
        <h2>🧵 Exclusive Collections</h2>

        {loading ? (
          <p className="loading-message">⏳ Loading products...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="product-grid">
            {products.length ? (
              products.map((product) => (
                <div key={product._id} className="product-card">
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
                  <h5 className="product-title">{product.name}</h5>
                  <p className="product-price">${product.price.toFixed(2)}</p>

                  {/* ✅ Correct endpoint */}
                  <Link to={`/product/${product._id}`} className="view-product-btn">
                    View Product
                  </Link>
                </div>
              ))
            ) : (
              <p className="no-products-message">🚨 No products available.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
