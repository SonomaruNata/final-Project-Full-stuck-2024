// client/src/pages/Shop/Shop.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Shop.css";

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data);
      } catch (err) {
        setError("Failed to load products. Please try again.");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ✅ Add to Cart Function with Success Message
  const addToCart = async (productId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/cart",
        { productId, quantity: 1 },
        { withCredentials: true }
      );
      alert("🛒 Product added to cart!");
      navigate("/cart");
    } catch (error) {
      console.error("❌ Error adding product to cart:", error);
      alert("Failed to add product to cart. Please try again.");
    }
  };

  return (
    <div className="shop-container">
      <div className="shop-header">
        <h1>🛍️ Trendy & Elegant Collection</h1>
        <p>Discover the latest fashion trends and elevate your style.</p>
      </div>

      {loading ? (
        <p className="shop-loading">Fetching the latest styles...</p>
      ) : error ? (
        <p className="shop-error">{error}</p>
      ) : (
        <div className="shop-products">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} className="shop-card">
                <div className="shop-card-body">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="product-image"
                  />
                  <h5 className="shop-card-title">{product.name}</h5>
                  <p className="shop-card-price">${product.price}</p>
                  <Link
                    to={`/shop/${product._id}`}
                    className="shop-view-btn"
                  >
                    View Product
                  </Link>
                  <button
                    className="shop-add-to-cart-btn"
                    onClick={() => addToCart(product._id)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="shop-empty">No products available.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Shop;
