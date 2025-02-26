// client/src/pages/ProductDetails/ProductDetails.js
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  // ✅ Fetch Product Details with useCallback
  const fetchProduct = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/products/${id}`
      );
      setProduct(response.data);
    } catch (err) {
      setError("Failed to load product.");
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // ✅ Add to Cart Function with Success Message
  const addToCart = async () => {
    try {
      await axios.post("http://localhost:5000/api/cart", { productId: id, quantity });

      alert("🛒 Product added to cart!");
      navigate("/cart");
    } catch (error) {
      console.error("❌ Error adding product to cart:", error);
      alert("Failed to add product to cart. Please try again.");
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
              src={product.imageUrl}
              alt={product.name}
              className="product-image"
            />
          </div>
          <div className="product-info">
            <h2 className="product-title">{product.name}</h2>
            <p className="product-description">{product.description}</p>
            <h3 className="product-price">${product.price}</h3>
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                min="1"
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <button onClick={addToCart} className="add-to-cart-btn">
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
