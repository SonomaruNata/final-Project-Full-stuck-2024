import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Products.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const fallbackImage = "/uploads/images/products/default.jpg";

const getImageUrl = (path) => path?.startsWith("http") ? path : `${API_URL}/${path || fallbackImage}`;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(null); // Product ID while adding
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products`);
        const formatted = res.data.map((p) => ({
          ...p,
          imageUrl: getImageUrl(p.imageUrl),
        }));
        setProducts(formatted);
      } catch (err) {
        console.error("❌ Fetch Error:", err);
        setError("⚠️ Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    setAdding(productId);
    try {
      await axios.post(`${API_URL}/api/cart`, { productId, quantity: 1 }, { withCredentials: true });
      alert("🛒 Added to cart!");
    } catch (err) {
      console.error("❌ Cart Error:", err);
      alert("❌ Error adding to cart. Please log in.");
    } finally {
      setAdding(null);
    }
  };

  return (
    <div className="products-container">
      <h1>🛍️ Explore Our Products</h1>

      {loading ? (
        <p className="loading-text">⏳ Loading products...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="product-image"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = fallbackImage;
                }}
              />
              <h3>{product.name}</h3>
              <p>${product.price?.toFixed(2)}</p>
              <div className="product-actions">
                <button onClick={() => navigate(`/product/${product._id}`)}>Product Details</button>
                <button
                  onClick={() => handleAddToCart(product._id)}
                  disabled={adding === product._id}
                >
                  {adding === product._id ? "Adding..." : "Add to Cart"}
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
