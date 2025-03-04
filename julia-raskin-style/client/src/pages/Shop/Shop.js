import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Shop.css"; // ✅ Imported Beautiful CSS

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Fetch Products with useCallback
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${API_URL}/api/products`, {
        withCredentials: true,
      });
      console.log("✅ Products Loaded:", response.data);
      setProducts(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "⚠️ Error loading products. Try again later.");
      console.error("❌ Error fetching products:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Fetch Products on Component Mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ✅ Add to Cart Function
  const addToCart = async (productId) => {
    try {
      await axios.post(`${API_URL}/api/cart`, { productId, quantity: 1 }, { withCredentials: true });
      alert("🛒 Product added to cart!");
      navigate("/cart");
    } catch (error) {
      console.error("❌ Error adding product to cart:", error);
      alert("⚠️ Failed to add product to cart. Please try again.");
    }
  };

  return (
    <div className="shop-container">
      {/* 🌟 Header Section */}
      <div className="shop-header">
        <h1>Discover Our Collection</h1>
        <p>Find the best products just for you!</p>
      </div>

      {loading && <p>Loading products...</p>}
      {error && <p className="error-message">{error}</p>}

      {/* 🌟 Product Grid */}
      <div className="shop-products">
        {products.map((product) => (
          <div key={product._id} className="shop-card">
            <img src={product.imageUrl} alt={product.name} className="product-image" />
            <h3 className="shop-card-title">{product.name}</h3>
            <p className="shop-card-price">${product.price.toFixed(2)}</p>
            <div className="product-actions">
              <button className="shop-view-btn" onClick={() => navigate(`/product/${product._id}`)}>
                View Item
              </button>
              <button className="shop-add-to-cart-btn" onClick={() => addToCart(product._id)}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
