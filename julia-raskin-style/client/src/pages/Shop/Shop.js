import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Shop.css";

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
                <div className="shop-card-img">
                 
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="shop-card-body">
                  <h5 className="shop-card-title">{product.name}</h5>
                  <p className="shop-card-price">${product.price}</p>
                  <Link to={`/shop/${product._id}`} className="shop-btn">
                    View Product
                  </Link>
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
